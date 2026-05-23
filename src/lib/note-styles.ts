import type { NoteType } from "@/types/note";

export const typeBadgeStyles: Record<NoteType, string> = {
  examen:
    "border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_20px_-4px_rgba(232,121,249,0.4)]",
  trabajo:
    "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_20px_-4px_rgba(34,211,238,0.4)]",
  repaso:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_20px_-4px_rgba(52,211,153,0.4)]",
};

export const typeGlowStyles: Record<NoteType, string> = {
  examen: "from-fuchsia-500/20 via-transparent to-transparent",
  trabajo: "from-cyan-500/20 via-transparent to-transparent",
  repaso: "from-emerald-500/20 via-transparent to-transparent",
};

export const typeBorderAccent: Record<NoteType, string> = {
  examen: "border-l-fuchsia-500",
  trabajo: "border-l-cyan-400",
  repaso: "border-l-emerald-400",
};
