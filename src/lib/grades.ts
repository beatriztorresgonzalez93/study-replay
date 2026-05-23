import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
  emptyTrabajoMatrix,
  type Section,
} from "@/lib/constants";
import { connectDB } from "@/lib/mongodb";
import { GradeSheet, serializeSheet } from "@/models/GradeSheet";
import type { GradeSheetData } from "@/types/grades";

export async function getOrCreateSheet(section: Section): Promise<GradeSheetData> {
  await connectDB();

  let doc = await GradeSheet.findOne({ section });
  if (!doc) {
    doc = await GradeSheet.create({ section });
  }

  return serializeSheet(doc, section);
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
        repasoCells: [],
      },
      $set: { [`examGrades.${subjectIndex}`]: grade },
    },
    { upsert: true, new: true },
  );

  return serializeSheet(doc!, "examen");
}

export async function updateTrabajoGrade(
  subjectIndex: number,
  topicIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  await connectDB();

  const doc = await GradeSheet.findOneAndUpdate(
    { section: "trabajos" },
    {
      $setOnInsert: {
        section: "trabajos",
        subjectNames: DEFAULT_SUBJECT_NAMES,
        examGrades: Array(SUBJECT_COUNT).fill(""),
        repasoCells: [],
      },
      $set: { [`trabajoGrades.${subjectIndex}.${topicIndex}`]: grade },
    },
    { upsert: true, new: true },
  );

  return serializeSheet(doc!, "trabajos");
}

export async function addRepasoAttempt(
  subjectIndex: number,
  topicIndex: number,
  grade: string,
): Promise<GradeSheetData> {
  await connectDB();

  let doc = await GradeSheet.findOne({ section: "repaso" });
  if (!doc) {
    doc = await GradeSheet.create({ section: "repaso" });
  }

  const plain = serializeSheet(doc, "repaso");
  const idx = plain.repasoCells.findIndex(
    (c) => c.subjectIndex === subjectIndex && c.topicIndex === topicIndex,
  );

  const attemptNumber =
    idx >= 0 ? plain.repasoCells[idx].attempts.length + 1 : 1;

  const newAttempt = {
    attemptNumber,
    grade: grade.trim(),
    createdAt: new Date(),
  };

  const repasoCells = plain.repasoCells.map((c) => ({
    subjectIndex: c.subjectIndex,
    topicIndex: c.topicIndex,
    attempts: c.attempts.map((a) => ({
      attemptNumber: a.attemptNumber,
      grade: a.grade,
      createdAt: new Date(a.createdAt),
    })),
  }));

  if (idx >= 0) {
    repasoCells[idx].attempts.push(newAttempt);
  } else {
    repasoCells.push({
      subjectIndex,
      topicIndex,
      attempts: [newAttempt],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc.repasoCells = repasoCells as any;
  doc.markModified("repasoCells");
  await doc.save();

  return serializeSheet(doc, "repaso");
}
