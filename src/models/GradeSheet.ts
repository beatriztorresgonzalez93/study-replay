import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
  DEFAULT_SUBJECT_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
  emptyTrabajoMatrix,
  type Section,
} from "@/lib/constants";

const repasoAttemptSchema = new Schema(
  {
    attemptNumber: { type: Number, required: true },
    grade: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const repasoCellSchema = new Schema(
  {
    subjectIndex: { type: Number, required: true, min: 0, max: SUBJECT_COUNT - 1 },
    topicIndex: { type: Number, required: true, min: 0, max: TOPIC_COUNT - 1 },
    attempts: { type: [repasoAttemptSchema], default: [] },
  },
  { _id: false },
);

const gradeSheetSchema = new Schema(
  {
    section: {
      type: String,
      enum: ["examen", "trabajos", "repaso"],
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
    trabajoGrades: {
      type: [[String]],
      default: emptyTrabajoMatrix,
    },
    repasoCells: {
      type: [repasoCellSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export type GradeSheetDocument = InferSchemaType<typeof gradeSheetSchema>;

export const GradeSheet: Model<GradeSheetDocument> =
  mongoose.models.GradeSheet ??
  mongoose.model("GradeSheet", gradeSheetSchema);

function toPlainMatrix(matrix: unknown): string[][] {
  if (!Array.isArray(matrix)) return emptyTrabajoMatrix();
  return matrix.map((row) => {
    if (!Array.isArray(row)) return Array(TOPIC_COUNT).fill("");
    return row.map((cell) => String(cell ?? ""));
  });
}

export function serializeSheet(
  doc: GradeSheetDocument,
  section: Section,
): import("@/types/grades").GradeSheetData {
  const cells = (doc.repasoCells ?? []).map((cell) => ({
    subjectIndex: cell.subjectIndex,
    topicIndex: cell.topicIndex,
    attempts: (cell.attempts ?? []).map((a) => ({
      attemptNumber: a.attemptNumber,
      grade: a.grade,
      createdAt: new Date(a.createdAt).toISOString(),
    })),
  }));

  return {
    section,
    subjectNames: [...(doc.subjectNames ?? DEFAULT_SUBJECT_NAMES)],
    examGrades: [...(doc.examGrades ?? Array(SUBJECT_COUNT).fill(""))].map(
      (g) => String(g ?? ""),
    ),
    trabajoGrades: toPlainMatrix(doc.trabajoGrades),
    repasoCells: cells,
  };
}
