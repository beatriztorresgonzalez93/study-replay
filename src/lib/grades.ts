import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COUNT,
  emptyTrabajoMatrix,
  type Section,
} from "@/lib/constants";
import { connectDB } from "@/lib/mongodb";
import {
  GradeSheet,
  migrateTrabajoMatrixToCells,
  matrixHasGrades,
  serializeSheet,
  toPlainMatrix,
} from "@/models/GradeSheet";
import type { GradeSheetData, TopicCell } from "@/types/grades";
import type { TeoriaSheetData } from "@/types/teoria";
import { serializeTeoriaSheet } from "@/models/GradeSheet";
import { getSubjectNames } from "@/lib/subjects";

async function withSubjectNames<T extends { subjectNames: string[] }>(
  sheet: T,
): Promise<T> {
  return { ...sheet, subjectNames: await getSubjectNames() };
}

export async function getOrCreateTeoriaSheet(): Promise<TeoriaSheetData> {
  await connectDB();

  let doc = await GradeSheet.findOne({ section: "teoria" });
  if (!doc) {
    doc = await GradeSheet.create({ section: "teoria" });
  }

  return withSubjectNames(serializeTeoriaSheet(doc));
}

export async function toggleTeoriaTopic(
  subjectIndex: number,
  topicIndex: number,
  completed: boolean,
): Promise<TeoriaSheetData> {
  await connectDB();

  const doc = await GradeSheet.findOneAndUpdate(
    { section: "teoria" },
    {
      $setOnInsert: {
        section: "teoria",
        subjectNames: DEFAULT_SUBJECT_NAMES,
      },
      $set: { [`teoriaCompleted.${subjectIndex}.${topicIndex}`]: completed },
    },
    { upsert: true, new: true },
  );

  return withSubjectNames(serializeTeoriaSheet(doc!));
}

export async function getOrCreateSheet(
  section: "examen" | "trabajos" | "repaso",
): Promise<GradeSheetData>;
export async function getOrCreateSheet(section: Section): Promise<GradeSheetData | TeoriaSheetData>;
export async function getOrCreateSheet(section: Section): Promise<GradeSheetData | TeoriaSheetData> {
  if (section === "teoria") {
    return getOrCreateTeoriaSheet();
  }

  await connectDB();

  let doc = await GradeSheet.findOne({ section });
  if (!doc) {
    doc = await GradeSheet.create({ section });
  }

  if (section === "trabajos") {
    const matrix = toPlainMatrix(doc.trabajoGrades);
    const hasCells = (doc.trabajoCells?.length ?? 0) > 0;
    if (!hasCells && matrixHasGrades(matrix)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doc.trabajoCells = migrateTrabajoMatrixToCells(matrix) as any;
      doc.markModified("trabajoCells");
      await doc.save();
    }
  }

  return withSubjectNames(serializeSheet(doc, section));
}

export async function updateExamenGrade(
  subjectIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  await connectDB();

  const doc = await GradeSheet.findOneAndUpdate(
    { section: "examen" },
    {
      $setOnInsert: {
        section: "examen",
        subjectNames: DEFAULT_SUBJECT_NAMES,
        trabajoGrades: emptyTrabajoMatrix(),
        trabajoCells: [],
        repasoCells: [],
      },
      $set: { [`examGrades.${subjectIndex}`]: grade },
    },
    { upsert: true, new: true },
  );

  return withSubjectNames(serializeSheet(doc!, "examen"));
}

function plainCells(cells: TopicCell[]) {
  return cells.map((c) => ({
    subjectIndex: c.subjectIndex,
    topicIndex: c.topicIndex,
    attempts: c.attempts.map((a) => ({
      attemptNumber: a.attemptNumber,
      grade: a.grade,
      createdAt: new Date(a.createdAt),
    })),
  }));
}

async function addTopicCellGrade(
  section: "trabajos" | "repaso",
  cellsField: "trabajoCells" | "repasoCells",
  subjectIndex: number,
  topicIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  await connectDB();

  let doc = await GradeSheet.findOne({ section });
  if (!doc) {
    doc = await GradeSheet.create({ section });
  }

  const plain = serializeSheet(doc, section);
  const currentCells =
    cellsField === "trabajoCells" ? plain.trabajoCells : plain.repasoCells;

  const idx = currentCells.findIndex(
    (c) => c.subjectIndex === subjectIndex && c.topicIndex === topicIndex,
  );

  const attemptNumber = idx >= 0 ? currentCells[idx].attempts.length + 1 : 1;

  const newAttempt = {
    attemptNumber,
    grade: grade.trim(),
    createdAt: new Date(),
  };

  const updatedCells = plainCells(currentCells);

  if (idx >= 0) {
    updatedCells[idx].attempts.push(newAttempt);
  } else {
    updatedCells.push({
      subjectIndex,
      topicIndex,
      attempts: [newAttempt],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc[cellsField] = updatedCells as any;
  doc.markModified(cellsField);
  await doc.save();

  return withSubjectNames(serializeSheet(doc, section));
}

export async function addTrabajoEntry(
  subjectIndex: number,
  topicIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  return addTopicCellGrade(
    "trabajos",
    "trabajoCells",
    subjectIndex,
    topicIndex,
    grade,
  );
}

export async function addRepasoAttempt(
  subjectIndex: number,
  topicIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  return addTopicCellGrade(
    "repaso",
    "repasoCells",
    subjectIndex,
    topicIndex,
    grade,
  );
}
