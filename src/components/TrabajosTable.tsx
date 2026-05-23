"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_TOPIC_NAMES, SUBJECT_COUNT, TOPIC_COUNT } from "@/lib/constants";
import type { GradeSheetData } from "@/types/grades";

export function TrabajosTable({ initial }: { initial: GradeSheetData }) {
  const router = useRouter();
  const [matrix, setMatrix] = useState(initial.trabajoGrades);
  const [saving, setSaving] = useState<string | null>(null);

  async function save(subjectIndex: number, topicIndex: number, grade: string) {
    const key = `${subjectIndex}-${topicIndex}`;
    setSaving(key);
    const res = await fetch("/api/sheets/trabajos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectIndex, topicIndex, grade }),
    });
    setSaving(null);
    if (res.ok) {
      const data = await res.json();
      setMatrix(data.trabajoGrades);
      router.refresh();
    }
  }

  return (
    <div className="glass rounded-2xl p-3 md:p-4">
      <div className="table-scroll">
        <table className="grade-table">
          <thead>
            <tr>
              <th>Asignatura</th>
              {DEFAULT_TOPIC_NAMES.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SUBJECT_COUNT }, (_, si) => (
              <tr key={si}>
                <td>
                  <span className="subject-label">{initial.subjectNames[si]}</span>
                </td>
                {Array.from({ length: TOPIC_COUNT }, (_, ti) => (
                  <td key={ti}>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="cell-input"
                      placeholder="—"
                      value={matrix[si]?.[ti] ?? ""}
                      disabled={saving === `${si}-${ti}`}
                      onChange={(e) => {
                        const next = matrix.map((row) => [...row]);
                        next[si][ti] = e.target.value;
                        setMatrix(next);
                      }}
                      onBlur={(e) => {
                        const prev = initial.trabajoGrades[si]?.[ti] ?? "";
                        if (e.target.value !== prev) {
                          save(si, ti, e.target.value);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="label-tech mt-3 px-1">9 temas por asignatura · guardado al salir del campo</p>
    </div>
  );
}
