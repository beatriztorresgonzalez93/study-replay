"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NOTE_TYPES, NOTE_TYPE_LABELS, type NoteType } from "@/types/note";

const activeRing: Record<NoteType | "all", string> = {
  all: "shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)] border-cyan-500/50 bg-cyan-500/15 text-cyan-200",
  examen:
    "shadow-[0_0_20px_-4px_rgba(232,121,249,0.5)] border-fuchsia-500/50 bg-fuchsia-500/15 text-fuchsia-200",
  trabajo:
    "shadow-[0_0_20px_-4px_rgba(34,211,238,0.5)] border-cyan-500/50 bg-cyan-500/15 text-cyan-200",
  repaso:
    "shadow-[0_0_20px_-4px_rgba(52,211,153,0.5)] border-emerald-500/50 bg-emerald-500/15 text-emerald-200",
};

export function NotesFilter() {
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") as NoteType | null;

  function hrefFor(type: NoteType | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (type) params.set("type", type);
    else params.delete("type");
    const q = params.toString();
    return q ? `/?${q}` : "/";
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <FilterChip href={hrefFor(null)} active={!currentType} ringKey="all">
        Todas
      </FilterChip>
      {NOTE_TYPES.map((type) => (
        <FilterChip
          key={type}
          href={hrefFor(type)}
          active={currentType === type}
          ringKey={type}
        >
          {NOTE_TYPE_LABELS[type]}
        </FilterChip>
      ))}
    </div>
  );
}

function FilterChip({
  href,
  active,
  ringKey,
  children,
}: {
  href: string;
  active: boolean;
  ringKey: NoteType | "all";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide transition ${
        active
          ? activeRing[ringKey]
          : "border-white/[0.06] bg-white/[0.03] text-zinc-500 hover:border-white/10 hover:text-zinc-300"
      }`}
    >
      {children}
    </Link>
  );
}
