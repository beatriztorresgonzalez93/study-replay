import { NextResponse } from "next/server";
import { SECTIONS, type Section } from "@/lib/constants";
import { getOrCreateSheet } from "@/lib/grades";

type RouteContext = { params: Promise<{ section: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { section } = await context.params;

    if (!SECTIONS.includes(section as Section)) {
      return NextResponse.json({ error: "Sección no válida" }, { status: 400 });
    }

    const sheet = await getOrCreateSheet(section as Section);
    return NextResponse.json(sheet);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error al cargar datos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
