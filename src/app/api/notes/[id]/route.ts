import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { NOTE_TYPES } from "@/types/note";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    await connectDB();
    const note = await Note.findById(id).lean();

    if (!note) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      _id: String(note._id),
      title: note.title,
      content: note.content,
      type: note.type,
      subject: note.subject,
      tags: note.tags ?? [],
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo cargar la nota" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.content !== undefined) updates.content = String(body.content).trim();
    if (body.subject !== undefined) updates.subject = String(body.subject).trim();
    if (body.type !== undefined) {
      if (!NOTE_TYPES.includes(body.type)) {
        return NextResponse.json({ error: "Tipo no válido" }, { status: 400 });
      }
      updates.type = body.type;
    }
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags.map((t: string) => t.trim()).filter(Boolean)
        : [];
    }

    await connectDB();
    const note = await Note.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).lean();

    if (!note) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      _id: String(note._id),
      title: note.title,
      content: note.content,
      type: note.type,
      subject: note.subject,
      tags: note.tags ?? [],
      createdAt: note.createdAt.toISOString(),
      updatedAt: note.updatedAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar la nota" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "ID no válido" }, { status: 400 });
    }

    await connectDB();
    const note = await Note.findByIdAndDelete(id);

    if (!note) {
      return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la nota" },
      { status: 500 },
    );
  }
}
