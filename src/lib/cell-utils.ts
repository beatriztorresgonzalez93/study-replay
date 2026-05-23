import type { GradeAttempt, TopicCell } from "@/types/grades";

export function getAttemptsForCell(
  cells: TopicCell[],
  subjectIndex: number,
  topicIndex: number,
): GradeAttempt[] {
  const cell = cells.find(
    (c) => c.subjectIndex === subjectIndex && c.topicIndex === topicIndex,
  );
  return cell?.attempts ?? [];
}

const ORDINAL_FEM = ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "7ª", "8ª", "9ª", "10ª"];
const ORDINAL_MASC = ["1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º", "10º"];

export function entryLabel(n: number, kind: "repaso" | "trabajo" = "repaso") {
  const labels = kind === "trabajo" ? ORDINAL_MASC : ORDINAL_FEM;
  return labels[n - 1] ?? (kind === "trabajo" ? `${n}º` : `${n}ª`);
}
