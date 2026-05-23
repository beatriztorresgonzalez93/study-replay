export const NOTE_TYPES = ["examen", "trabajo", "repaso"] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export interface Note {
  _id: string;
  title: string;
  content: string;
  type: NoteType;
  subject: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  examen: "Examen",
  trabajo: "Trabajo",
  repaso: "Repaso",
};
