import { NextResponse } from "next/server";
import { SUBJECT_COUNT, TOPIC_COUNT } from "@/lib/constants";
import { updateTrabajoGrade } from "@/lib/grades";

export async function PATCH(request: Request) {
  try {
    const { subjectIndex, topicIndex, grade } = await request.json();

    if (
      typeof subjectIndex !== "number" ||
      subjectIndex < 0 ||
      subjectIndex >= SUBJECT_COUNT ||
      typeof topicIndex !== "number" ||
      topicIndex < 0 ||
      topicIndex >= TOPIC_COUNT
    ) {
      return NextResponse.json({ error: "Celda no válida" }, { status: 400 });
    }

    const sheet = await updateTrabajoGrade(
      subjectIndex,
      topicIndex,
      String(grade ?? "").trim(),
    );
    return NextResponse.json(sheet);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al guardar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
