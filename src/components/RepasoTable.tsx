"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubjectCardsMobile } from "@/components/SubjectCardsMobile";
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
    <div className="w-full min-w-0 space-y-1.5">
      {attempts.length === 0 ? (
        <p className="text-center font-mono text-[10px] text-zinc-600">sin tests</p>
      ) : (
        <ul className="space-y-1">
          {attempts.map((a) => (
            <li
              key={`${a.attemptNumber}-${a.createdAt}`}
              className="flex items-center justify-between gap-2 rounded border border-white/[0.06] bg-black/30 px-2 py-1"
            >
              <span className="font-mono text-[10px] text-emerald-500/80">
                {attemptLabel(a.attemptNumber)}
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
            attempts.length === 0 ? "1ª" : `${attemptLabel(attempts.length + 1)}`
          }
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
          className="shrink-0 rounded-lg bg-emerald-500/20 px-3 py-2 font-mono text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/30 disabled:opacity-40"
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

  const onSaved = (updated: GradeSheetData["repasoCells"]) => {
    setCells(updated);
    router.refresh();
  };

  return (
    <div className="glass rounded-2xl p-3 md:p-4">
      <SubjectCardsMobile
        subjectNames={initial.subjectNames}
        borderClass="border-emerald-500/20"
      >
        {(si) => (
          <div className="space-y-2">
            {Array.from({ length: TOPIC_COUNT }, (_, ti) => (
              <div
                key={ti}
                className="rounded-xl border border-white/[0.06] bg-black/20 p-3"
              >
                <p className="label-tech mb-2 text-emerald-500/70">
                  {DEFAULT_TOPIC_NAMES[ti]}
                </p>
                <RepasoCellEditor
                  subjectIndex={si}
                  topicIndex={ti}
                  attempts={getRepasoAttemptsForCell(cells, si, ti)}
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
                      <RepasoCellEditor
                        subjectIndex={si}
                        topicIndex={ti}
                        attempts={getRepasoAttemptsForCell(cells, si, ti)}
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
        Cada + registra un nuevo intento (1ª, 2ª, 3ª…) con su nota
      </p>
    </div>
  );
}
