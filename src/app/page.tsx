import Link from "next/link";
import { PageLayout } from "@/components/PageLayout";
import { SubjectNamesEditor } from "@/components/SubjectNamesEditor";
import { SECTION_LABELS, TFG_LABEL } from "@/lib/constants";
import { getSubjectNames } from "@/lib/subjects";

const cards = [
  {
    title: SECTION_LABELS.teoria,
    href: "/teoria",
    desc: "Marca los temas que ya estudiaste",
    gradient: "from-amber-500/25 to-transparent",
    border: "border-amber-500/25 hover:border-amber-500/40",
    accent: "text-amber-400/80",
  },
  {
    title: SECTION_LABELS.examen,
    href: "/examen",
    desc: "Nota del examen por asignatura",
    gradient: "from-fuchsia-500/20 to-transparent",
    border: "border-fuchsia-500/25 hover:border-fuchsia-500/40",
    accent: "text-fuchsia-400/80",
  },
  {
    title: SECTION_LABELS.trabajos,
    href: "/trabajos",
    desc: "Varios trabajos por tema",
    gradient: "from-cyan-500/20 to-transparent",
    border: "border-cyan-500/25 hover:border-cyan-500/40",
    accent: "text-cyan-400/80",
  },
  {
    title: SECTION_LABELS.repaso,
    href: "/repaso",
    desc: "Tests por tema, varios intentos",
    gradient: "from-emerald-500/20 to-transparent",
    border: "border-emerald-500/25 hover:border-emerald-500/40",
    accent: "text-emerald-400/80",
  },
  {
    title: TFG_LABEL,
    href: "/tfg",
    desc: "Próximamente",
    gradient: "from-violet-500/20 to-transparent",
    border: "border-violet-500/25 hover:border-violet-500/40",
    accent: "text-violet-400/80",
  },
] as const;

export default async function Home() {
  let subjectNames: string[] = [];
  let subjectsError = false;

  try {
    subjectNames = await getSubjectNames();
  } catch {
    subjectsError = true;
  }

  return (
    <PageLayout wide>
      <div className="mt-2 space-y-6 md:mt-4">
        {!subjectsError && (
          <SubjectNamesEditor initialNames={subjectNames} />
        )}

        <section>
          <h2 className="label-tech mb-3">Secciones</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cards.map(({ title, href, desc, gradient, border, accent }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`glass glass-hover relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 ${border}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient}`}
                    aria-hidden
                  />
                  <div className="relative flex flex-1 flex-col">
                    <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-zinc-50">
                      {title}
                    </h3>
                    <p className={`mt-2 flex-1 text-sm ${accent}`}>{desc}</p>
                    <span className="label-tech mt-4 text-zinc-600">
                      Abrir →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
