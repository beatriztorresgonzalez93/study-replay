import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { NOTE_TYPES } from "@/types/note";

const noteSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    type: {
      type: String,
      enum: NOTE_TYPES,
      required: true,
    },
    subject: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

noteSchema.index({ type: 1, subject: 1, createdAt: -1 });

export type NoteDocument = InferSchemaType<typeof noteSchema>;

export const Note: Model<NoteDocument> =
  mongoose.models.Note ?? mongoose.model("Note", noteSchema);
