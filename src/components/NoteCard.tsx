import Link from "next/link";
import type { Note } from "@/types/note";
import { NOTE_TYPE_LABELS } from "@/types/note";
import {
  typeBadgeStyles,
  typeBorderAccent,
  typeGlowStyles,
} from "@/lib/note-styles";

export function NoteCard({ note }: { note: Note }) {
  const preview =
    note.content.length > 120
      ? `${note.content.slice(0, 120)}…`
      : note.content;

  const date = new Date(note.updatedAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link
      href={`/notas/${note._id}`}
      className={`glass glass-hover group relative block overflow-hidden rounded-2xl border-l-[3px] p-4 ${typeBorderAccent[note.type]}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100 ${typeGlowStyles[note.type]}`}
        aria-hidden
      />

      <div className="relative">
        <div className="mb-3 flex items-start justify-between gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${typeBadgeStyles[note.type]}`}
          >
            {NOTE_TYPE_LABELS[note.type]}
          </span>
          <time className="font-mono text-[11px] text-zinc-500">{date}</time>
        </div>

        <h2 className="mb-1 font-[family-name:var(--font-syne)] text-lg font-semibold text-zinc-50 group-hover:text-white">
          {note.title}
        </h2>

        <p className="mb-2 font-mono text-xs text-cyan-500/80">{note.subject}</p>

        {preview && (
          <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500">
            {preview}
          </p>
        )}

        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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
    </Link>
  );
}
