"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubjectCardsMobile } from "@/components/SubjectCardsMobile";
import {
  DEFAULT_TOPIC_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
} from "@/lib/constants";
import { entryLabel, getAttemptsForCell } from "@/lib/cell-utils";
import type { GradeAttempt, GradeSheetData } from "@/types/grades";

function TrabajoCellEditor({
  subjectIndex,
  topicIndex,
  attempts: initialAttempts,
  onSaved,
}: {
  subjectIndex: number;
  topicIndex: number;
  attempts: GradeAttempt[];
  onSaved: (cells: GradeSheetData["trabajoCells"]) => void;
}) {
  const [attempts, setAttempts] = useState(initialAttempts);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function addEntry() {
    const grade = value.trim();
    if (!grade) return;

    setLoading(true);
    const res = await fetch("/api/sheets/trabajos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectIndex, topicIndex, grade }),
    });
    setLoading(false);

    if (res.ok) {
      const data: GradeSheetData = await res.json();
      const updated = getAttemptsForCell(
        data.trabajoCells,
        subjectIndex,
        topicIndex,
      );
      setAttempts(updated);
      setValue("");
      onSaved(data.trabajoCells);
    }
  }

  return (
    <div className="w-full min-w-0 space-y-1.5">
      {attempts.length === 0 ? (
        <p className="text-center font-mono text-[10px] text-zinc-600">sin trabajos</p>
      ) : (
        <ul className="space-y-1">
          {attempts.map((a) => (
            <li
              key={`${a.attemptNumber}-${a.createdAt}`}
              className="flex items-center justify-between gap-2 rounded border border-white/[0.06] bg-black/30 px-2 py-1"
            >
              <span className="font-mono text-[10px] text-cyan-500/80">
                {entryLabel(a.attemptNumber, "trabajo")}
              </span>
              <span className="text-sm font-medium text-zinc-200">{a.grade}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="decimal"
          className="cell-input min-w-0 flex-1 text-sm"
          placeholder={
            attempts.length === 0
              ? "1º"
              : entryLabel(attempts.length + 1, "trabajo")
          }
          value={value}
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addEntry();
          }}
        />
        <button
          type="button"
          onClick={addEntry}
          disabled={loading || !value.trim()}
          className="shrink-0 rounded-lg bg-cyan-500/20 px-3 py-2 font-mono text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/30 disabled:opacity-40"
          title="Añadir trabajo"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function TrabajosTable({ initial }: { initial: GradeSheetData }) {
  const router = useRouter();
  const [cells, setCells] = useState(initial.trabajoCells);

  const onSaved = (updated: GradeSheetData["trabajoCells"]) => {
    setCells(updated);
    router.refresh();
  };

  return (
    <div className="glass rounded-2xl p-3 md:p-4">
      <SubjectCardsMobile
        subjectNames={initial.subjectNames}
        borderClass="border-cyan-500/20"
      >
        {(si) => (
          <div className="space-y-2">
            {Array.from({ length: TOPIC_COUNT }, (_, ti) => (
              <div
                key={ti}
                className="rounded-xl border border-white/[0.06] bg-black/20 p-3"
              >
                <p className="label-tech mb-2 text-cyan-500/70">
                  {DEFAULT_TOPIC_NAMES[ti]}
                </p>
                <TrabajoCellEditor
                  subjectIndex={si}
                  topicIndex={ti}
                  attempts={getAttemptsForCell(cells, si, ti)}
                  onSaved={onSaved}
                />
              </div>
            ))}
          </div>
        )}
      </SubjectCardsMobile>

      <div className="hidden md:block">
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
                      <TrabajoCellEditor
                        subjectIndex={si}
                        topicIndex={ti}
                        attempts={getAttemptsForCell(cells, si, ti)}
                        onSaved={onSaved}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="label-tech mt-3 px-1">
        Cada + añade un trabajo más en ese tema (1º, 2º, 3º…)
      </p>
    </div>
  );
}
