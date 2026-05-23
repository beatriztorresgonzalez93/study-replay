import dns from "dns";
import mongoose from "mongoose";

dns.setDefaultResultOrder("ipv4first");

const MONGODB_URI = process.env.MONGODB_URI;
const DEFAULT_DB = "study-replay";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Corrige URIs mal formadas (p. ej. //study-replay → study-replay).
 * Un doble slash provoca el error "Invalid namespace: /study-replay.notes".
 */
export function normalizeMongoUri(uri: string): string {
  const trimmed = uri.trim().replace(/^["']|["']$/g, "");

  if (
    !trimmed.startsWith("mongodb://") &&
    !trimmed.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      "MONGODB_URI debe empezar por mongodb:// o mongodb+srv:// (no uses una API key suelta)",
    );
  }

  const qIndex = trimmed.indexOf("?");
  const query = qIndex >= 0 ? trimmed.slice(qIndex + 1) : "";
  const authorityAndPath = qIndex >= 0 ? trimmed.slice(0, qIndex) : trimmed;

  const protoEnd = authorityAndPath.indexOf("://") + 3;
  const slashIndex = authorityAndPath.indexOf("/", protoEnd);

  const authority =
    slashIndex >= 0
      ? authorityAndPath.slice(0, slashIndex)
      : authorityAndPath;

  let dbName =
    slashIndex >= 0
      ? authorityAndPath.slice(slashIndex + 1).replace(/^\/+|\/+$/g, "")
      : "";

  if (!dbName) {
    dbName = DEFAULT_DB;
  }

  let normalized = `${authority}/${dbName}`;
  if (query) {
    normalized += `?${query}`;
  }

  // Por si queda algún // entre host y base de datos
  normalized = normalized.replace(/(@[^/?#]+)\/{2,}/g, "$1/");

  return normalized;
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "Define MONGODB_URI en .env.local (o en Vercel → Environment Variables)",
    );
  }

  const uri = normalizeMongoUri(MONGODB_URI);

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .catch((err: Error) => {
        cached.promise = null;
        const msg = err.message ?? "";

        if (msg.includes("Invalid namespace")) {
          throw new Error(
            "URI de MongoDB mal formada (doble / en el nombre de la base). Usa: ...mongodb.net/study-replay sin //",
          );
        }
        if (msg.includes("querySrv") || msg.includes("ECONNREFUSED")) {
          throw new Error(
            "No se pudo resolver el cluster (DNS/SRV). En Atlas: Connect → copia la cadena completa. En local con Windows, prueba la cadena «Standard» (sin +srv) o permite 0.0.0.0/0 en Network Access.",
          );
        }
        if (msg.includes("bad auth") || msg.includes("Authentication failed")) {
          throw new Error(
            "Usuario o contraseña incorrectos. Usa el usuario de base de datos de Atlas (no la Data API key). Si la contraseña tiene @ # % encódala en la URI.",
          );
        }
        if (msg.includes("IP") || msg.includes("whitelist")) {
          throw new Error(
            "Tu IP no está permitida en Atlas. En Network Access añade 0.0.0.0/0 (o la IP de Vercel).",
          );
        }

        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
