import { AppHeader } from "@/components/AppHeader";
import { NoteForm } from "@/components/NoteForm";

export default function NuevaNotaPage() {
  return (
    <>
      <AppHeader title="Nueva nota" backHref="/" subtitle="crear" />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-6">
        <NoteForm />
      </main>
    </>
  );
}
