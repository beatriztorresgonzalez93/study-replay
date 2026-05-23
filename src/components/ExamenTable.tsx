"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUBJECT_COUNT } from "@/lib/constants";
import type { GradeSheetData } from "@/types/grades";

export function ExamenTable({ initial }: { initial: GradeSheetData }) {
  const router = useRouter();
  const [grades, setGrades] = useState(initial.examGrades);
  const [saving, setSaving] = useState<number | null>(null);

  async function save(subjectIndex: number, grade: string) {
    setSaving(subjectIndex);
    const res = await fetch("/api/sheets/examen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectIndex, grade }),
    });
    setSaving(null);
    if (res.ok) {
      const data = await res.json();
      setGrades(data.examGrades);
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
              <th>Nota examen</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SUBJECT_COUNT }, (_, i) => (
              <tr key={i}>
                <td>
                  <span className="subject-label">{initial.subjectNames[i]}</span>
                </td>
                <td>
                  <input
                    type="text"
                    inputMode="decimal"
                    className="cell-input"
                    placeholder="—"
                    value={grades[i] ?? ""}
                    disabled={saving === i}
                    onChange={(e) => {
                      const next = [...grades];
                      next[i] = e.target.value;
                      setGrades(next);
                    }}
                    onBlur={(e) => {
                      if (e.target.value !== (initial.examGrades[i] ?? "")) {
                        save(i, e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="label-tech mt-3 px-1">Enter o salir del campo para guardar</p>
    </div>
  );
}
