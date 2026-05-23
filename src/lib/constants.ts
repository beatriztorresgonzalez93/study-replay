export const SUBJECT_COUNT = 8;
export const TOPIC_COUNT = 9;

export const DEFAULT_SUBJECT_NAMES = [
  "Sistemas programables avanzados",
  "Robótica industrial",
  "Comunicaciones industriales",
  "Integración de sistemas de automatización industrial",
  "Simulación de sistemas mecatrónicos",
  "Proyecto de automatización y robótica industrial",
  "Itinerario para la empleabilidad II",
  "Asignatura 8",
];

export const DEFAULT_TOPIC_NAMES = Array.from(
  { length: TOPIC_COUNT },
  (_, i) => `T${i + 1}`,
);

export const SECTIONS = ["examen", "trabajos", "repaso", "teoria"] as const;

export type Section = (typeof SECTIONS)[number];

export const SECTION_LABELS: Record<Section, string> = {
  examen: "Examen",
  trabajos: "Trabajos",
  repaso: "Repaso",
  teoria: "Teoría",
};

export const TFG_LABEL = "TFG";

export function emptyBooleanMatrix(): boolean[][] {
  return Array.from({ length: SUBJECT_COUNT }, () =>
    Array(TOPIC_COUNT).fill(false),
  );
}

export function emptyTrabajoMatrix(): string[][] {
  return Array.from({ length: SUBJECT_COUNT }, () =>
    Array(TOPIC_COUNT).fill(""),
  );
}
