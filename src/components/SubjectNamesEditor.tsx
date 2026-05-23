"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_SUBJECT_NAMES, SUBJECT_COUNT } from "@/lib/constants";

export function SubjectNamesEditor({
  initialNames,
}: {
  initialNames: string[];
}) {
  const router = useRouter();
  const [names, setNames] = useState(initialNames);
  const [saving, setSaving] = useState<number | null>(null);

  async function save(index: number, value: string) {
    const trimmed = value.trim();
    const final = trimmed || DEFAULT_SUBJECT_NAMES[index];
    if (final === initialNames[index] && names[index] === final) return;

    setSaving(index);
    const res = await fetch("/api/settings/subjects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index, name: final }),
    });
    setSaving(null);

    if (res.ok) {
      const data = await res.json();
      setNames(data.subjectNames);
      router.refresh();
    }
  }

  return (
    <section className="glass rounded-2xl border-cyan-500/10 p-4 md:p-5">
      <p className="mb-4 text-sm text-zinc-500">
        Pon el nombre real de cada una. Los cambios se aplican en todas las
        secciones.
      </p>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {Array.from({ length: SUBJECT_COUNT }, (_, i) => (
          <li key={i}>
            <label className="flex flex-col gap-1.5">
              <span className="label-tech text-zinc-600">
                Asignatura {i + 1}
              </span>
              <input
                type="text"
                className="input-tech !py-2.5 text-sm"
                value={names[i] ?? ""}
                placeholder={DEFAULT_SUBJECT_NAMES[i]}
                disabled={saving === i}
                onChange={(e) => {
                  const next = [...names];
                  next[i] = e.target.value;
                  setNames(next);
                }}
                onBlur={(e) => save(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                }}
              />
            </label>
          </li>
        ))}
      </ul>
      <p className="label-tech mt-3 text-zinc-600">
        Enter o salir del campo para guardar
      </p>
    </section>
  );
}
