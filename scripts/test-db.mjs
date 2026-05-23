import { readFileSync } from "fs";
import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");

function loadEnv(path) {
  try {
    const raw = readFileSync(path, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

loadEnv(".env");
loadEnv(".env.local");

let uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("FAIL: MONGODB_URI no definida");
  process.exit(1);
}

console.log("URI length:", uri.length);
console.log("Scheme:", uri.split("://")[0]);
console.log("Has credentials (@):", uri.includes("@"));
const needsDb = !/mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(uri);
console.log("Has db name:", !needsDb);
if (needsDb) {
  const [base, query] = uri.split("?");
  uri = `${base}/study-replay${query ? `?${query}` : ""}`;
  console.log("(añadido /study-replay automáticamente para la prueba)");
}

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("OK: conexion exitosa");
  await mongoose.disconnect();
} catch (err) {
  console.error("FAIL:", err.message);
  process.exit(1);
}
