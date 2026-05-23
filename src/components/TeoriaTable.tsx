"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SubjectCardsMobile } from "@/components/SubjectCardsMobile";
import {
  DEFAULT_TOPIC_NAMES,
  SUBJECT_COUNT,
  TOPIC_COUNT,
} from "@/lib/constants";
import type { TeoriaSheetData } from "@/types/teoria";

function TeoriaCheckbox({
  subjectIndex: si,
  topicIndex: ti,
  subjectName,
  checked,
  loading,
  onToggle,
}: {
  subjectIndex: number;
  topicIndex: number;
  subjectName: string;
  checked: boolean;
  loading: boolean;
  onToggle: (si: number, ti: number, completed: boolean) => void;
}) {
  return (
    <label
      className={`teoria-check flex cursor-pointer items-center justify-center rounded-lg border p-2.5 transition ${
        checked
          ? "border-amber-500/50 bg-amber-500/20 shadow-[0_0_16px_-4px_rgba(245,158,11,0.5)]"
          : "border-white/[0.08] bg-black/25 hover:border-amber-500/30"
      } ${loading ? "opacity-50" : ""}`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={loading}
        onChange={(e) => onToggle(si, ti, e.target.checked)}
        aria-label={`${subjectName} ${DEFAULT_TOPIC_NAMES[ti]}${checked ? ", completado" : ""}`}
      />
      <span
        className={`flex h-5 w-5 items-center justify-center rounded border-2 text-xs font-bold transition ${
          checked
            ? "border-amber-400 bg-amber-400 text-[#1a1000]"
            : "border-zinc-600 bg-transparent text-transparent"
        }`}
      >
        ✓
      </span>
    </label>
  );
}

export function TeoriaTable({ initial }: { initial: TeoriaSheetData }) {
  const router = useRouter();
  const [matrix, setMatrix] = useState(initial.teoriaCompleted);
  const [saving, setSaving] = useState<string | null>(null);

  const { done, total } = useMemo(() => {
    let d = 0;
    const t = SUBJECT_COUNT * TOPIC_COUNT;
    matrix.forEach((row) => row.forEach((v) => v && d++));
    return { done: d, total: t };
  }, [matrix]);

  async function toggle(si: number, ti: number, completed: boolean) {
    const key = `${si}-${ti}`;
    setSaving(key);

    const prev = matrix[si]?.[ti] ?? false;
    const next = matrix.map((row) => [...row]);
    next[si][ti] = completed;
    setMatrix(next);

    const res = await fetch("/api/sheets/teoria", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectIndex: si, topicIndex: ti, completed }),
    });

    setSaving(null);

    if (!res.ok) {
      const rollback = matrix.map((row) => [...row]);
      rollback[si][ti] = prev;
      setMatrix(rollback);
      return;
    }

    const data: TeoriaSheetData = await res.json();
    setMatrix(data.teoriaCompleted);
    router.refresh();
  }

  return (
    <div className="glass rounded-2xl border-amber-500/15 p-3 md:p-4">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <p className="font-mono text-xs text-amber-400/90">
          {done}/{total} temas estudiados
        </p>
        <div className="h-1.5 max-w-[8rem] flex-1 overflow-hidden rounded-full bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
            style={{ width: `${total ? (done / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      <SubjectCardsMobile
        subjectNames={initial.subjectNames}
        borderClass="border-amber-500/20"
      >
        {(si) => (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: TOPIC_COUNT }, (_, ti) => {
              const checked = matrix[si]?.[ti] ?? false;
              const loading = saving === `${si}-${ti}`;
              return (
                <div
                  key={ti}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-white/[0.04] bg-black/20 p-2"
                >
                  <span className="font-mono text-[10px] font-medium text-amber-500/70">
                    {DEFAULT_TOPIC_NAMES[ti]}
                  </span>
                  <TeoriaCheckbox
                    subjectIndex={si}
                    topicIndex={ti}
                    subjectName={initial.subjectNames[si]}
                    checked={checked}
                    loading={loading}
                    onToggle={toggle}
                  />
                </div>
              );
            })}
          </div>
        )}
      </SubjectCardsMobile>

      <div className="hidden md:block">
        <div className="table-scroll">
          <table className="grade-table teoria-table">
            <thead>
              <tr>
                <th className="!text-amber-500/70">Asignatura</th>
                {DEFAULT_TOPIC_NAMES.map((name) => (
                  <th key={name} className="!text-amber-500/70">
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: SUBJECT_COUNT }, (_, si) => (
                <tr key={si}>
                  <td>
                    <span className="subject-label">{initial.subjectNames[si]}</span>
                  </td>
                  {Array.from({ length: TOPIC_COUNT }, (_, ti) => {
                    const checked = matrix[si]?.[ti] ?? false;
                    const loading = saving === `${si}-${ti}`;
                    return (
                      <td key={ti} className="text-center">
                        <TeoriaCheckbox
                          subjectIndex={si}
                          topicIndex={ti}
                          subjectName={initial.subjectNames[si]}
                          checked={checked}
                          loading={loading}
                          onToggle={toggle}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="label-tech mt-3 px-1 text-amber-600/80">
        Marca cada tema cuando lo hayas terminado
      </p>
    </div>
  );
}
