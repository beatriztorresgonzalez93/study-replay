import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { AppHeader } from "@/components/AppHeader";
import { NoteForm } from "@/components/NoteForm";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import type { Note as NoteType } from "@/types/note";

export default async function EditarNotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  try {
    await connectDB();
  } catch {
    notFound();
  }

  const doc = await Note.findById(id).lean();
  if (!doc) notFound();

  const initial: NoteType = {
    _id: String(doc._id),
    title: doc.title,
    content: doc.content,
    type: doc.type,
    subject: doc.subject,
    tags: doc.tags ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };

  return (
    <>
      <AppHeader title="Editar" backHref={`/notas/${id}`} subtitle="modificar" />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-6">
        <NoteForm initial={initial} />
      </main>
    </>
  );
}
