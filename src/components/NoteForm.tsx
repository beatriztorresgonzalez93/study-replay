"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  NOTE_TYPES,
  NOTE_TYPE_LABELS,
  type Note,
  type NoteType,
} from "@/types/note";

type NoteFormProps = {
  initial?: Note;
};

export function NoteForm({ initial }: NoteFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [type, setType] = useState<NoteType>(initial?.type ?? "examen");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(", ") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const payload = { title, content, type, subject, tags };
    const url = initial ? `/api/notes/${initial._id}` : "/api/notes";
    const method = initial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Algo salió mal");
      return;
    }

    const note = await res.json();
    router.push(initial ? `/notas/${note._id}` : "/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Título">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-tech"
          placeholder="Ej. Parcial tema 3"
        />
      </Field>

      <Field label="Materia">
        <input
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="input-tech"
          placeholder="Ej. Matemáticas"
        />
      </Field>

      <Field label="Tipo">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as NoteType)}
          className="input-tech appearance-none"
        >
          {NOTE_TYPES.map((t) => (
            <option key={t} value={t} className="bg-zinc-900">
              {NOTE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Contenido">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="input-tech resize-y"
          placeholder="Apuntes, fórmulas, preguntas clave…"
        />
      </Field>

      <Field label="Etiquetas">
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="input-tech"
          placeholder="parcial, tema3"
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-mono text-sm text-rose-300">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Guardando…" : initial ? "Guardar cambios" : "Crear nota"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="label-tech">{label}</span>
      {children}
    </label>
  );
}
