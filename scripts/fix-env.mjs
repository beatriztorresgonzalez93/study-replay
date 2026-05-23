import { readFileSync, writeFileSync } from "fs";

function normalizeUri(uri) {
  let u = uri.trim().replace(/^["']|["']$/g, "");
  if (!u.startsWith("mongodb://") && !u.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI debe ser una cadena mongodb:// o mongodb+srv://");
  }
  const [base, query] = u.split("?");
  const pathStart = base.indexOf("/", base.indexOf("://") + 3);
  const hasDb = pathStart !== -1 && base.slice(pathStart + 1).length > 0;
  if (!hasDb) {
    u = `${base}/study-replay${query ? `?${query}` : ""}`;
  }
  if (!u.includes("retryWrites")) {
    u += `${u.includes("?") ? "&" : "?"}retryWrites=true&w=majority`;
  }
  return u;
}

function fixFile(path) {
  const text = readFileSync(path, "utf8");
  let uri = null;

  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    if (key === "MONGODB_URI") {
      uri = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }

  if (!uri) {
    throw new Error(`${path}: falta MONGODB_URI`);
  }

  const fixed = normalizeUri(uri);
  const body = `# MongoDB Atlas — Connect → Drivers → Node.js
# Variable usada por Next.js (no subas este archivo a GitHub)
MONGODB_URI=${fixed}
`;

  writeFileSync(path, body, "utf8");
  console.log(`${path}: OK (longitud ${fixed.length}, incluye /study-replay)`);
}

fixFile(".env.local");
fixFile(".env");
