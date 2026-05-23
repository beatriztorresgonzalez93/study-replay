import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SectionNav } from "@/components/SectionNav";
import { SECTION_LABELS, type Section } from "@/lib/constants";

const cards: {
  section: Section;
  href: string;
  desc: string;
  gradient: string;
  border: string;
}[] = [
  {
    section: "examen",
    href: "/examen",
    desc: "8 asignaturas · 1 nota de examen por asignatura",
    gradient: "from-fuchsia-500/20 to-transparent",
    border: "border-fuchsia-500/25 hover:border-fuchsia-500/40",
  },
  {
    section: "trabajos",
    href: "/trabajos",
    desc: "8 asignaturas · 9 temas con nota de trabajo",
    gradient: "from-cyan-500/20 to-transparent",
    border: "border-cyan-500/25 hover:border-cyan-500/40",
  },
  {
    section: "repaso",
    href: "/repaso",
    desc: "8 asignaturas · 9 tests por tema, varios intentos",
    gradient: "from-emerald-500/20 to-transparent",
    border: "border-emerald-500/25 hover:border-emerald-500/40",
  },
];

export default function Home() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-5 pb-10">
        <SectionNav />
        <p className="mt-6 text-sm leading-relaxed text-zinc-500">
          Registra tus notas en tablas. Elige una sección para empezar.
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {cards.map(({ section, href, desc, gradient, border }) => (
            <li key={section}>
              <Link
                href={href}
                className={`glass glass-hover relative block overflow-hidden rounded-2xl border p-5 ${border}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`}
                  aria-hidden
                />
                <div className="relative">
                  <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-zinc-50">
                    {SECTION_LABELS[section]}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">{desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
