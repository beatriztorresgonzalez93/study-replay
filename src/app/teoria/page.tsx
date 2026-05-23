export const dynamic = "force-dynamic";

import { DbErrorBanner } from "@/components/DbErrorBanner";
import { PageLayout } from "@/components/PageLayout";
import { TeoriaTable } from "@/components/TeoriaTable";
import { getOrCreateTeoriaSheet } from "@/lib/grades";

export default async function TeoriaPage() {
  let sheet = null;
  let error: string | null = null;

  try {
    sheet = await getOrCreateTeoriaSheet();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error de conexión";
  }

  return (
    <PageLayout
      wide
      title="Teoría"
      subtitle="temas"
      description="Marca cada tema cuando lo hayas terminado de estudiar."
    >
      {error ? (
        <DbErrorBanner message={error} />
      ) : sheet ? (
        <div className="mt-2">
          <TeoriaTable initial={sheet} />
        </div>
      ) : null}
    </PageLayout>
  );
}
