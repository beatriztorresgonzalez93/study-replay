import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { NOTE_TYPES, type NoteType } from "@/types/note";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const subject = searchParams.get("subject");

    if (type && !NOTE_TYPES.includes(type as NoteType)) {
      return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
    }

    await connectDB();

    const query: Record<string, string> = {};
    if (type) query.type = type;
    if (subject) query.subject = subject;

    const notes = await Note.find(query).sort({ updatedAt: -1 }).lean();

    return NextResponse.json(
      notes.map((note) => ({
        _id: String(note._id),
        title: note.title,
        content: note.content,
        type: note.type,
        subject: note.subject,
        tags: note.tags ?? [],
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      })),
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las notas" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, type, subject, tags } = body;

    if (!title?.trim() || !type || !subject?.trim()) {
      return NextResponse.json(
        { error: "Título, tipo y materia son obligatorios" },
        { status: 400 },
      );
    }

    if (!NOTE_TYPES.includes(type)) {
      return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
    }

    await connectDB();

    const note = await Note.create({
      title: title.trim(),
      content: content?.trim() ?? "",
      type,
      subject: subject.trim(),
      tags: Array.isArray(tags)
        ? tags.map((t: string) => t.trim()).filter(Boolean)
        : [],
    });

    return NextResponse.json(
      {
        _id: String(note._id),
        title: note.title,
        content: note.content,
        type: note.type,
        subject: note.subject,
        tags: note.tags,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear la nota" },
      { status: 500 },
    );
  }
}
