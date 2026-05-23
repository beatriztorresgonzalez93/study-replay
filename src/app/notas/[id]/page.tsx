import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { AppHeader } from "@/components/AppHeader";
import { DeleteNoteButton } from "@/components/DeleteNoteButton";
import { connectDB } from "@/lib/mongodb";
import { Note } from "@/models/Note";
import { typeBadgeStyles } from "@/lib/note-styles";
import { NOTE_TYPE_LABELS } from "@/types/note";

export default async function NotaPage({
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

  const note = await Note.findById(id).lean();
  if (!note) notFound();

  const updated = new Date(note.updatedAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <AppHeader title={note.title} backHref="/" subtitle="nota" />

      <main className="mx-auto max-w-2xl flex-1 px-4 py-6">
        <div className="glass mb-6 rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${typeBadgeStyles[note.type]}`}
            >
              {NOTE_TYPE_LABELS[note.type]}
            </span>
            <span className="font-mono text-xs text-cyan-500/80">{note.subject}</span>
            <span className="text-zinc-600">·</span>
            <span className="font-mono text-xs text-zinc-500">{updated}</span>
          </div>

          {note.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <article className="whitespace-pre-wrap text-base leading-relaxed text-zinc-300">
          {note.content || (
            <span className="font-mono text-sm text-zinc-600 italic">
              // sin_contenido
            </span>
          )}
        </article>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/notas/${id}/editar`} className="btn-primary text-sm">
            Editar
          </Link>
          <DeleteNoteButton noteId={id} />
        </div>
      </main>
    </>
  );
}
