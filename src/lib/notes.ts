import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import type { NoteType } from "@/types/note";

export async function getNotes(filters?: { type?: NoteType; subject?: string }) {
  await connectDB();

  const query: Record<string, string> = {};
  if (filters?.type) query.type = filters.type;
  if (filters?.subject) query.subject = filters.subject;

  const notes = await Note.find(query).sort({ updatedAt: -1 }).lean();

  return notes.map((note) => ({
    _id: String(note._id),
    title: note.title,
    content: note.content,
    type: note.type,
    subject: note.subject,
    tags: note.tags ?? [],
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  }));
}
