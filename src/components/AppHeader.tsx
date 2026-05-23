import Link from "next/link";

export function AppHeader({
  title,
  backHref,
  subtitle,
}: {
  title?: string;
  backHref?: string;
  subtitle?: string;
}) {
  const isHome = !backHref && !title;

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#030306]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16">
        {backHref ? (
          <Link
            href={backHref}
            className="btn-ghost flex h-10 w-10 shrink-0 items-center justify-center !p-0 font-mono text-lg"
            aria-label="Volver"
          >
            ←
          </Link>
        ) : null}

        <div className="min-w-0 flex-1">
          {isHome ? (
            <>
              <p className="label-tech mb-0.5">v0.1 · study os</p>
              <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight">
                <span className="text-gradient">Study</span>
                <span className="text-zinc-500">//</span>
                <span className="text-zinc-100">Replay</span>
              </h1>
            </>
          ) : (
            <>
              {subtitle && <p className="label-tech mb-0.5">{subtitle}</p>}
              <h1 className="truncate font-[family-name:var(--font-syne)] text-lg font-semibold text-zinc-100">
                {title}
              </h1>
            </>
          )}
        </div>

        {isHome && (
          <div
            className="h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]"
            title="Online"
          />
        )}
      </div>
    </header>
  );
}
