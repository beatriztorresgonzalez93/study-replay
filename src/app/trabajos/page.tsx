export const dynamic = "force-dynamic";

import { DbErrorBanner } from "@/components/DbErrorBanner";
import { PageLayout } from "@/components/PageLayout";
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
    <PageLayout
      wide
      title="Trabajos"
      subtitle="notas"
      description="Varios trabajos por tema (1º, 2º, 3º…) en cada asignatura."
    >
      {error ? (
        <DbErrorBanner message={error} />
      ) : sheet ? (
        <div className="mt-2">
          <TrabajosTable initial={sheet} />
        </div>
      ) : null}
    </PageLayout>
  );
}
