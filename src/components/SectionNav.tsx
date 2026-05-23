"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTION_LABELS, TFG_LABEL } from "@/lib/constants";

const links: { href: string; label: string; accent: string }[] = [
  { href: "/teoria", label: SECTION_LABELS.teoria, accent: "border-amber-500/50 text-amber-300" },
  { href: "/examen", label: SECTION_LABELS.examen, accent: "border-fuchsia-500/50 text-fuchsia-300" },
  { href: "/trabajos", label: SECTION_LABELS.trabajos, accent: "border-cyan-500/50 text-cyan-300" },
  { href: "/repaso", label: SECTION_LABELS.repaso, accent: "border-emerald-500/50 text-emerald-300" },
  { href: "/tfg", label: TFG_LABEL, accent: "border-violet-500/50 text-violet-300" },
];

export function SectionNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1">
      <Link
        href="/"
        className={`shrink-0 rounded-full border px-3 py-2 font-mono text-xs uppercase tracking-wide transition ${
          pathname === "/"
            ? "border-white/20 bg-white/10 text-zinc-100"
            : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"
        }`}
      >
        Inicio
      </Link>
      {links.map(({ href, label, accent }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono text-xs font-medium uppercase tracking-wide transition ${
              active
                ? `${accent} bg-white/[0.06] shadow-[0_0_20px_-6px_currentColor]`
                : "border-white/[0.06] text-zinc-500 hover:border-white/10 hover:text-zinc-300"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
