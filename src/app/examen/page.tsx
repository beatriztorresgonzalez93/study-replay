export const dynamic = "force-dynamic";

import { AppHeader } from "@/components/AppHeader";
import { DbErrorBanner } from "@/components/DbErrorBanner";
import { ExamenTable } from "@/components/ExamenTable";
import { SectionNav } from "@/components/SectionNav";
import { getOrCreateSheet } from "@/lib/grades";

export default async function ExamenPage() {
  let sheet = null;
  let error: string | null = null;

  try {
    sheet = await getOrCreateSheet("examen");
  } catch (err) {
    error = err instanceof Error ? err.message : "Error de conexión";
  }

  return (
    <>
      <AppHeader title="Examen" backHref="/" subtitle="notas" />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-5 pb-10">
        <SectionNav />
        <p className="mt-4 text-sm text-zinc-500">
          Una nota de examen por cada asignatura.
        </p>
        {error ? (
          <DbErrorBanner message={error} />
        ) : sheet ? (
          <div className="mt-5">
            <ExamenTable initial={sheet} />
          </div>
        ) : null}
      </main>
    </>
  );
}
