import type { Section } from "@/lib/constants";

export interface RepasoAttempt {
  attemptNumber: number;
  grade: string;
  createdAt: string;
}

export interface RepasoCell {
  subjectIndex: number;
  topicIndex: number;
  attempts: RepasoAttempt[];
}

export interface GradeSheetData {
  section: Section;
  subjectNames: string[];
  examGrades: string[];
  trabajoGrades: string[][];
  repasoCells: RepasoCell[];
}
