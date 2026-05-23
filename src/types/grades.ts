import type { Section } from "@/lib/constants";

export interface GradeAttempt {
  attemptNumber: number;
  grade: string;
  createdAt: string;
}

export interface TopicCell {
  subjectIndex: number;
  topicIndex: number;
  attempts: GradeAttempt[];
}

/** @deprecated Usar GradeAttempt */
export type RepasoAttempt = GradeAttempt;

/** @deprecated Usar TopicCell */
export type RepasoCell = TopicCell;

export interface GradeSheetData {
  section: Section;
  subjectNames: string[];
  examGrades: string[];
  trabajoCells: TopicCell[];
  repasoCells: TopicCell[];
}
