import { readFileSync, writeFileSync } from "fs";

function normalizeUri(uri) {
  let u = uri.trim().replace(/^["']|["']$/g, "");
  if (!u.startsWith("mongodb://") && !u.startsWith("mongodb+srv://")) {
    throw new Error("MONGODB_URI debe ser una cadena mongodb:// o mongodb+srv://");
  }

  const qIndex = u.indexOf("?");
  const query = qIndex >= 0 ? u.slice(qIndex + 1) : "";
  const base = qIndex >= 0 ? u.slice(0, qIndex) : u;

  const protoEnd = base.indexOf("://") + 3;
  const slashIndex = base.indexOf("/", protoEnd);
  const authority = slashIndex >= 0 ? base.slice(0, slashIndex) : base;
  let dbName =
    slashIndex >= 0
      ? base.slice(slashIndex + 1).replace(/^\/+|\/+$/g, "")
      : "";

  if (!dbName) dbName = "study-replay";

  u = `${authority}/${dbName}`;
  if (query) u += `?${query}`;
  u = u.replace(/(@[^/?#]+)\/{2,}/g, "$1/");

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
    console.log(`${path}: sin MONGODB_URI, omitido`);
    return;
  }

  const fixed = normalizeUri(uri);
  const hadDoubleSlash = uri.includes(".net//") || uri.includes(".net///");

  const body = `# MongoDB Atlas — Connect → Drivers → Node.js
# Formato: ...mongodb.net/study-replay  (una sola /, no //)
MONGODB_URI=${fixed}
`;

  writeFileSync(path, body, "utf8");
  console.log(
    `${path}: OK${hadDoubleSlash ? " (corregido doble /)" : ""} → db=study-replay`,
  );
}

fixFile(".env.local");
