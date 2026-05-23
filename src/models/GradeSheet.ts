import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
  emptyBooleanMatrix,
  emptyTrabajoMatrix,
  type Section,
} from "@/lib/constants";

const gradeAttemptSchema = new Schema(
  {
    attemptNumber: { type: Number, required: true },
    grade: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const topicCellSchema = new Schema(
  {
    subjectIndex: { type: Number, required: true, min: 0, max: SUBJECT_COUNT - 1 },
    topicIndex: { type: Number, required: true, min: 0, max: TOPIC_COUNT - 1 },
    attempts: { type: [gradeAttemptSchema], default: [] },
  },
  { _id: false },
);

const gradeSheetSchema = new Schema(
  {
    section: {
      type: String,
      enum: ["examen", "trabajos", "repaso", "teoria", "config"],
      required: true,
      unique: true,
    },
    subjectNames: {
      type: [String],
      default: () => [...DEFAULT_SUBJECT_NAMES],
    },
    examGrades: {
      type: [String],
      default: () => Array(SUBJECT_COUNT).fill(""),
    },
    /** @deprecated Migrado a trabajoCells */
    trabajoGrades: {
      type: [[String]],
      default: emptyTrabajoMatrix,
    },
    trabajoCells: {
      type: [topicCellSchema],
      default: [],
    },
    repasoCells: {
      type: [topicCellSchema],
      default: [],
    },
    teoriaCompleted: {
      type: [[Boolean]],
      default: emptyBooleanMatrix,
    },
  },
  { timestamps: true },
);

export type GradeSheetDocument = InferSchemaType<typeof gradeSheetSchema>;

export const GradeSheet: Model<GradeSheetDocument> =
  mongoose.models.GradeSheet ??
  mongoose.model("GradeSheet", gradeSheetSchema);

function serializeCells(cells: GradeSheetDocument["trabajoCells"]) {
  return (cells ?? []).map((cell) => ({
    subjectIndex: cell.subjectIndex,
    topicIndex: cell.topicIndex,
    attempts: (cell.attempts ?? []).map((a) => ({
      attemptNumber: a.attemptNumber,
      grade: a.grade,
      createdAt: new Date(a.createdAt).toISOString(),
    })),
  }));
}

function toPlainMatrix(matrix: unknown): string[][] {
  if (!Array.isArray(matrix)) return emptyTrabajoMatrix();
  return matrix.map((row) => {
    if (!Array.isArray(row)) return Array(TOPIC_COUNT).fill("");
    return row.map((cell) => String(cell ?? ""));
  });
}

export function migrateTrabajoMatrixToCells(
  matrix: string[][],
): { subjectIndex: number; topicIndex: number; attempts: { attemptNumber: number; grade: string; createdAt: Date }[] }[] {
  const cells: {
    subjectIndex: number;
    topicIndex: number;
    attempts: { attemptNumber: number; grade: string; createdAt: Date }[];
  }[] = [];

  matrix.forEach((row, si) => {
    row.forEach((grade, ti) => {
      if (grade?.trim()) {
        cells.push({
          subjectIndex: si,
          topicIndex: ti,
          attempts: [
            { attemptNumber: 1, grade: grade.trim(), createdAt: new Date() },
          ],
        });
      }
    });
  });

  return cells;
}

export function matrixHasGrades(matrix: string[][]): boolean {
  return matrix.some((row) => row.some((g) => g?.trim()));
}

export function toPlainBooleanMatrix(matrix: unknown): boolean[][] {
  if (!Array.isArray(matrix)) return emptyBooleanMatrix();
  return matrix.map((row) => {
    if (!Array.isArray(row)) return Array(TOPIC_COUNT).fill(false);
    return row.map((cell) => Boolean(cell));
  });
}

export function serializeSheet(
  doc: GradeSheetDocument,
  section: Section,
): import("@/types/grades").GradeSheetData {
  return {
    section: section as "examen" | "trabajos" | "repaso",
    subjectNames: [...(doc.subjectNames ?? DEFAULT_SUBJECT_NAMES)],
    examGrades: [...(doc.examGrades ?? Array(SUBJECT_COUNT).fill(""))].map(
      (g) => String(g ?? ""),
    ),
    trabajoCells: serializeCells(doc.trabajoCells),
    repasoCells: serializeCells(doc.repasoCells),
  };
}

export function serializeTeoriaSheet(
  doc: GradeSheetDocument,
): import("@/types/teoria").TeoriaSheetData {
  return {
    section: "teoria",
    subjectNames: [...(doc.subjectNames ?? DEFAULT_SUBJECT_NAMES)],
    teoriaCompleted: toPlainBooleanMatrix(doc.teoriaCompleted),
  };
}

export { toPlainMatrix };
