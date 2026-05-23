export const dynamic = "force-dynamic";

import { DbErrorBanner } from "@/components/DbErrorBanner";
import { PageLayout } from "@/components/PageLayout";
import { SubjectNamesEditor } from "@/components/SubjectNamesEditor";
import { SUBJECTS_PAGE_LABEL } from "@/lib/constants";
import { getSubjectNames } from "@/lib/subjects";

export default async function AsignaturasPage() {
  let subjectNames: string[] = [];
  let error: string | null = null;

  try {
    subjectNames = await getSubjectNames();
  } catch (err) {
    error = err instanceof Error ? err.message : "Error de conexión";
  }

  return (
    <PageLayout
      title={SUBJECTS_PAGE_LABEL}
      subtitle="configuración"
      description="Los nombres se usan en Teoría, Examen, Trabajos y Repaso."
    >
      {error ? (
        <DbErrorBanner message={error} />
      ) : (
        <div className="mt-2">
          <SubjectNamesEditor initialNames={subjectNames} />
        </div>
      )}
    </PageLayout>
  );
}
