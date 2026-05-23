import Link from "next/link";
import { Suspense } from "react";
import { AppHeader } from "@/components/AppHeader";
import { NoteCard } from "@/components/NoteCard";
import { NotesFilter } from "@/components/NotesFilter";
import { getNotes } from "@/lib/notes";
import { NOTE_TYPES, type NoteType } from "@/types/note";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const type =
    params.type && NOTE_TYPES.includes(params.type as NoteType)
      ? (params.type as NoteType)
      : undefined;

  let notes: Awaited<ReturnType<typeof getNotes>> = [];
  let dbError = false;

  let dbErrorMessage: string | null = null;

  try {
    notes = await getNotes({ type });
  } catch (err) {
    dbError = true;
    dbErrorMessage =
      err instanceof Error ? err.message : "Error de conexión a MongoDB";
  }

  return (
    <>
      <AppHeader />

      <main className="mx-auto max-w-2xl flex-1 px-4 py-5 pb-28">
        <section className="mb-6">
          <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
            Tus apuntes de{" "}
            <span className="text-cyan-400/90">exámenes</span>,{" "}
            <span className="text-violet-400/90">trabajos</span> y{" "}
            <span className="text-emerald-400/90">repaso</span> en un solo sitio.
          </p>
          {!dbError && notes.length > 0 && (
            <p className="label-tech mt-3">
              {notes.length} {notes.length === 1 ? "entrada" : "entradas"}
              {type ? ` · filtro activo` : ""}
            </p>
          )}
        </section>

        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-white/5" />}>
          <NotesFilter />
        </Suspense>

        {dbError ? (
          <div className="glass mt-8 rounded-2xl border-amber-500/20 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-amber-400/80">
              // connection_error
            </p>
            <p className="mt-2 font-semibold text-amber-200">MongoDB no conectado</p>
            <p className="mt-2 text-sm text-zinc-500">
              Variable{" "}
              <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-cyan-400">
                MONGODB_URI
              </code>{" "}
              en <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-xs text-cyan-400">.env.local</code>{" "}
              o en Vercel. Cadena de Atlas (Connect → Drivers), no la API key.
            </p>
            {dbErrorMessage && (
              <p className="mt-3 rounded-lg bg-black/40 p-3 font-mono text-xs leading-relaxed text-rose-300/90">
                {dbErrorMessage}
              </p>
            )}
          </div>
        ) : notes.length === 0 ? (
          <div className="glass mt-16 rounded-2xl p-10 text-center">
            <p className="font-mono text-4xl text-zinc-700">∅</p>
            <p className="mt-3 text-zinc-500">Sin notas todavía</p>
            <Link href="/nueva" className="btn-primary mt-6 inline-block text-sm">
              Crear primera nota
            </Link>
          </div>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {notes.map((note) => (
              <li key={note._id}>
                <NoteCard note={note} />
              </li>
            ))}
          </ul>
        )}
      </main>

      <Link
        href="/nueva"
        className="fab-glow fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-light text-[#030306] transition"
        aria-label="Nueva nota"
      >
        +
      </Link>
    </>
  );
}
