import { NextResponse } from "next/server";
import { SUBJECT_COUNT } from "@/lib/constants";
import { getSubjectNames, updateSubjectName, updateSubjectNames } from "@/lib/subjects";

export async function GET() {
  try {
    const names = await getSubjectNames();
    return NextResponse.json({ subjectNames: names });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al cargar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body.names)) {
      if (body.names.length !== SUBJECT_COUNT) {
        return NextResponse.json(
          { error: `Se requieren ${SUBJECT_COUNT} nombres` },
          { status: 400 },
        );
      }
      const names = await updateSubjectNames(body.names);
      return NextResponse.json({ subjectNames: names });
    }

    const { index, name } = body;
    if (
      typeof index !== "number" ||
      index < 0 ||
      index >= SUBJECT_COUNT ||
      typeof name !== "string"
    ) {
      return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
    }

    const names = await updateSubjectName(index, name);
    return NextResponse.json({ subjectNames: names });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al guardar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
