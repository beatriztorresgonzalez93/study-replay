export const dynamic = "force-dynamic";

import { AppHeader } from "@/components/AppHeader";
import { DbErrorBanner } from "@/components/DbErrorBanner";
import { SectionNav } from "@/components/SectionNav";
import { TrabajosTable } from "@/components/TrabajosTable";
import { getOrCreateSheet } from "@/lib/grades";

export default async function TrabajosPage() {
  let sheet = null;
  let error: string | null = null;

  try {
    sheet = await getOrCreateSheet("trabajos");
  } catch (err) {
    error = err instanceof Error ? err.message : "Error de conexión";
  }

  return (
    <>
      <AppHeader title="Trabajos" backHref="/" subtitle="notas" />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-5 pb-10">
        <SectionNav />
        <p className="mt-4 text-sm text-zinc-500">
          Nota de trabajo por tema (T1–T9) en cada asignatura.
        </p>
        {error ? (
          <DbErrorBanner message={error} />
        ) : sheet ? (
          <div className="mt-5">
            <TrabajosTable initial={sheet} />
          </div>
        ) : null}
      </main>
    </>
  );
}
