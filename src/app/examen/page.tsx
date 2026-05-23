export const dynamic = "force-dynamic";

import { DbErrorBanner } from "@/components/DbErrorBanner";
import { ExamenTable } from "@/components/ExamenTable";
import { PageLayout } from "@/components/PageLayout";
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
    <PageLayout
      title="Examen"
      subtitle="notas"
      description="Una nota de examen por cada asignatura."
    >
      {error ? (
        <DbErrorBanner message={error} />
      ) : sheet ? (
        <div className="mt-2">
          <ExamenTable initial={sheet} />
        </div>
      ) : null}
    </PageLayout>
  );
}
