export const dynamic = "force-dynamic";

import { AppHeader } from "@/components/AppHeader";
import { DbErrorBanner } from "@/components/DbErrorBanner";
import { RepasoTable } from "@/components/RepasoTable";
import { SectionNav } from "@/components/SectionNav";
import { getOrCreateSheet } from "@/lib/grades";

export default async function RepasoPage() {
  let sheet = null;
  let error: string | null = null;

  try {
    sheet = await getOrCreateSheet("repaso");
  } catch (err) {
    error = err instanceof Error ? err.message : "Error de conexión";
  }

  return (
    <>
      <AppHeader title="Repaso" backHref="/" subtitle="tests" />
      <main className="mx-auto max-w-6xl flex-1 px-4 py-5 pb-10">
        <SectionNav />
        <p className="mt-4 text-sm text-zinc-500">
          Cada celda guarda varios intentos: 1ª vez, 2ª vez, 3ª vez…
        </p>
        {error ? (
          <DbErrorBanner message={error} />
        ) : sheet ? (
          <div className="mt-5">
            <RepasoTable initial={sheet} />
          </div>
        ) : null}
      </main>
    </>
  );
}
