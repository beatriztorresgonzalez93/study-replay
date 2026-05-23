import { NextResponse } from "next/server";
import { SUBJECT_COUNT } from "@/lib/constants";
import { updateExamenGrade } from "@/lib/grades";

export async function PATCH(request: Request) {
  try {
    const { subjectIndex, grade } = await request.json();

    if (
      typeof subjectIndex !== "number" ||
      subjectIndex < 0 ||
      subjectIndex >= SUBJECT_COUNT
    ) {
      return NextResponse.json({ error: "Asignatura no válida" }, { status: 400 });
    }

    const sheet = await updateExamenGrade(subjectIndex, String(grade ?? "").trim());
    return NextResponse.json(sheet);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al guardar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
