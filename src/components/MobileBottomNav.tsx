"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SECTION_LABELS, TFG_LABEL } from "@/lib/constants";

const items = [
  { href: "/", label: "Inicio", short: "⌂", accent: "text-zinc-100" },
  { href: "/teoria", label: SECTION_LABELS.teoria, short: "T", accent: "text-amber-400" },
  { href: "/examen", label: SECTION_LABELS.examen, short: "E", accent: "text-fuchsia-400" },
  { href: "/trabajos", label: SECTION_LABELS.trabajos, short: "W", accent: "text-cyan-400" },
  { href: "/repaso", label: SECTION_LABELS.repaso, short: "R", accent: "text-emerald-400" },
  { href: "/tfg", label: TFG_LABEL, short: "F", accent: "text-violet-400" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.06] bg-[#030306]/92 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Navegación principal"
    >
      <div className="mx-auto grid max-w-lg grid-cols-6 gap-0.5 px-1 pt-1.5">
        {items.map(({ href, label, short, accent }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition ${
                active
                  ? "bg-white/[0.08]"
                  : "text-zinc-500 active:bg-white/[0.05]"
              }`}
            >
              <span
                className={`font-mono text-sm font-bold leading-none ${active ? accent : ""}`}
              >
                {short}
              </span>
              <span
                className={`max-w-full truncate text-[9px] font-medium leading-tight ${
                  active ? "text-zinc-200" : "text-zinc-600"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
