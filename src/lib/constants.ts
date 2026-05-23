export const SUBJECT_COUNT = 8;
export const TOPIC_COUNT = 9;

export const DEFAULT_SUBJECT_NAMES = Array.from(
  { length: SUBJECT_COUNT },
  (_, i) => `Asignatura ${i + 1}`,
);

export const DEFAULT_TOPIC_NAMES = Array.from(
  { length: TOPIC_COUNT },
  (_, i) => `T${i + 1}`,
);

export const SECTIONS = ["examen", "trabajos", "repaso"] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  examen: "Examen",
  trabajos: "Trabajos",
  repaso: "Repaso",
};

export function emptyTrabajoMatrix(): string[][] {
  return Array.from({ length: SUBJECT_COUNT }, () =>
    Array(TOPIC_COUNT).fill(""),
  );
}
