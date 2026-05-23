import { readFileSync } from "fs";
import mongoose from "mongoose";

const NAMES = [
  "Sistemas programables avanzados",
  "Robótica industrial",
  "Comunicaciones industriales",
  "Integración de sistemas de automatización industrial",
  "Simulación de sistemas mecatrónicos",
  "Proyecto de automatización y robótica industrial",
  "Itinerario para la empleabilidad II",
  "Asignatura 8",
];

function loadEnv(path) {
  try {
    readFileSync(path, "utf8")
      .split("\n")
      .forEach((line) => {
        const t = line.trim();
        if (!t || t.startsWith("#")) return;
        const eq = t.indexOf("=");
        if (eq === -1) return;
        process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
      });
  } catch {
    /* ignore */
  }
}

loadEnv(".env");
loadEnv(".env.local");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Falta MONGODB_URI en .env.local");
  process.exit(1);
}

const gradeSheetSchema = new mongoose.Schema(
  {
    section: { type: String, required: true, unique: true },
    subjectNames: { type: [String], default: () => [...NAMES] },
  },
  { strict: false },
);

const GradeSheet =
  mongoose.models.GradeSheet ?? mongoose.model("GradeSheet", gradeSheetSchema);

await mongoose.connect(uri);

await GradeSheet.findOneAndUpdate(
  { section: "config" },
  { section: "config", subjectNames: NAMES },
  { upsert: true },
);

await GradeSheet.updateMany(
  { section: { $in: ["examen", "trabajos", "repaso", "teoria"] } },
  { $set: { subjectNames: NAMES } },
);

console.log("Asignaturas guardadas:");
NAMES.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));

await mongoose.disconnect();
