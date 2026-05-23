export function DbErrorBanner({ message }: { message: string }) {
  return (
    <div className="glass mt-6 rounded-2xl border-amber-500/20 p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-400/80">
        // connection_error
      </p>
      <p className="mt-2 font-semibold text-amber-200">MongoDB no conectado</p>
      <p className="mt-2 text-sm text-zinc-500">
        Revisa <code className="text-cyan-400">MONGODB_URI</code> en .env.local o Vercel.
      </p>
      <p className="mt-3 font-mono text-xs text-rose-300/90">{message}</p>
    </div>
  );
}
