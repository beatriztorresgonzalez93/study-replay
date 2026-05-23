import { PageLayout } from "@/components/PageLayout";
import { TFG_LABEL } from "@/lib/constants";

export default function TfgPage() {
  return (
    <PageLayout title={TFG_LABEL} subtitle="próximamente">
      <div className="glass mt-2 flex min-h-[14rem] flex-col items-center justify-center rounded-2xl border border-violet-500/20 p-8 text-center sm:min-h-[18rem] sm:p-12">
        <p className="label-tech mb-4 text-violet-400/80">// tfg_module</p>
        <p className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-transparent bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300 bg-clip-text sm:text-4xl">
          PRÓXIMAMENTE
        </p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
          Esta sección estará disponible pronto.
        </p>
      </div>
    </PageLayout>
  );
}
