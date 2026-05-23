import { DEFAULT_SUBJECT_NAMES, SUBJECT_COUNT } from "@/lib/constants";
import { connectDB } from "@/lib/mongodb";
import { GradeSheet } from "@/models/GradeSheet";

const DATA_SECTIONS = ["examen", "trabajos", "repaso", "teoria"] as const;

function normalizeNames(names: string[]): string[] {
  return Array.from({ length: SUBJECT_COUNT }, (_, i) => {
    const value = names[i]?.trim();
    return value || DEFAULT_SUBJECT_NAMES[i];
  });
}

function isPlaceholderNames(names: string[]): boolean {
  return Array.from({ length: SUBJECT_COUNT }, (_, i) => names[i]).every(
    (n, i) => n === `Asignatura ${i + 1}`,
  );
}

export async function getSubjectNames(): Promise<string[]> {
  await connectDB();

  let doc = await GradeSheet.findOne({ section: "config" });
  if (!doc) {
    const legacy = await GradeSheet.findOne({
      section: { $in: [...DATA_SECTIONS] },
      "subjectNames.0": { $exists: true },
    });
    const names = normalizeNames(legacy?.subjectNames ?? DEFAULT_SUBJECT_NAMES);
    doc = await GradeSheet.findOneAndUpdate(
      { section: "config" },
      { section: "config", subjectNames: names },
      { upsert: true, new: true },
    );
  }

  const stored = doc?.subjectNames ?? [];
  const names = normalizeNames([...stored]);

  if (stored.length > 0 && isPlaceholderNames(names)) {
    return updateSubjectNames([...DEFAULT_SUBJECT_NAMES]);
  }

  if (!doc) {
    return updateSubjectNames([...DEFAULT_SUBJECT_NAMES]);
  }

  return names;
}

export async function updateSubjectNames(names: string[]): Promise<string[]> {
  await connectDB();

  const normalized = normalizeNames(names);

  await GradeSheet.findOneAndUpdate(
    { section: "config" },
    { section: "config", subjectNames: normalized },
    { upsert: true },
  );

  await GradeSheet.updateMany(
    { section: { $in: [...DATA_SECTIONS] } },
    { $set: { subjectNames: normalized } },
  );

  return normalized;
}

export async function updateSubjectName(
  index: number,
  name: string,
): Promise<string[]> {
  const names = await getSubjectNames();
  names[index] = name.trim() || DEFAULT_SUBJECT_NAMES[index];
  return updateSubjectNames(names);
}
