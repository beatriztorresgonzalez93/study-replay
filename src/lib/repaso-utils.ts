import type { RepasoAttempt } from "@/types/grades";

export function getRepasoAttemptsForCell(
  cells: { subjectIndex: number; topicIndex: number; attempts: RepasoAttempt[] }[],
  subjectIndex: number,
  topicIndex: number,
): RepasoAttempt[] {
  const cell = cells.find(
    (c) => c.subjectIndex === subjectIndex && c.topicIndex === topicIndex,
  );
  return cell?.attempts ?? [];
}

export function attemptLabel(n: number) {
  const labels = ["1ª", "2ª", "3ª", "4ª", "5ª", "6ª", "7ª", "8ª", "9ª", "10ª"];
  return labels[n - 1] ?? `${n}ª`;
}
