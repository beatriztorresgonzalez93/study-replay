"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DEFAULT_TOPIC_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
} from "@/lib/constants";
import { attemptLabel, getRepasoAttemptsForCell } from "@/lib/repaso-utils";
import type { GradeSheetData, RepasoAttempt } from "@/types/grades";

function RepasoCellEditor({
  subjectIndex,
  topicIndex,
  attempts: initialAttempts,
  onSaved,
}: {
  subjectIndex: number;
  topicIndex: number;
  attempts: RepasoAttempt[];
  onSaved: (cells: GradeSheetData["repasoCells"]) => void;
}) {
  const [attempts, setAttempts] = useState(initialAttempts);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function addAttempt() {
    const grade = value.trim();
    if (!grade) return;

    setLoading(true);
    const res = await fetch("/api/sheets/repaso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectIndex, topicIndex, grade }),
    });
    setLoading(false);

    if (res.ok) {
      const data: GradeSheetData = await res.json();
      const updated = getRepasoAttemptsForCell(
        data.repasoCells,
        subjectIndex,
        topicIndex,
      );
      setAttempts(updated);
      setValue("");
      onSaved(data.repasoCells);
    }
  }

  return (
    <div className="min-w-[5.5rem] space-y-1.5 py-1">
      {attempts.length === 0 ? (
        <p className="text-center font-mono text-[10px] text-zinc-600">sin tests</p>
      ) : (
        <ul className="space-y-1">
          {attempts.map((a) => (
            <li
              key={`${a.attemptNumber}-${a.createdAt}`}
              className="flex items-center justify-between gap-1 rounded border border-white/[0.06] bg-black/30 px-1.5 py-0.5"
            >
              <span className="font-mono text-[10px] text-emerald-500/80">
                {attemptLabel(a.attemptNumber)}
              </span>
              <span className="text-xs font-medium text-zinc-200">{a.grade}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-1">
        <input
          type="text"
          inputMode="decimal"
          className="cell-input !min-w-0 flex-1 !px-1.5 !py-1 text-xs"
          placeholder={attempts.length === 0 ? "1ª" : `${attemptLabel(attempts.length + 1)}`}
          value={value}
          disabled={loading}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addAttempt();
          }}
        />
        <button
          type="button"
          onClick={addAttempt}
          disabled={loading || !value.trim()}
          className="shrink-0 rounded-md bg-emerald-500/20 px-2 py-1 font-mono text-[10px] font-medium text-emerald-300 transition hover:bg-emerald-500/30 disabled:opacity-40"
          title="Registrar intento"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function RepasoTable({ initial }: { initial: GradeSheetData }) {
  const router = useRouter();
  const [cells, setCells] = useState(initial.repasoCells);

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
                    <RepasoCellEditor
                      subjectIndex={si}
                      topicIndex={ti}
                      attempts={getRepasoAttemptsForCell(cells, si, ti)}
                      onSaved={(updated) => {
                        setCells(updated);
                        router.refresh();
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="label-tech mt-3 px-1">
        Cada + registra un nuevo intento (1ª, 2ª, 3ª…) con su nota
      </p>
    </div>
  );
}
