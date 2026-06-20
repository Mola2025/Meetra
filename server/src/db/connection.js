import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

let pool;

if (process.env.DATABASE_URL && !process.env.USE_MEMORY_DB) {
  const pkg = await import("pg");
  const { Pool } = pkg.default || pkg;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  const { newDb } = await import("pg-mem");
  const db = newDb();

  const schemaPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "schema.sql",
  );
  const schema = fs.readFileSync(schemaPath, "utf8");

  // Remove unsupported DROP IF EXISTS statements for pg-mem
  const cleanSchema = schema
    .replace(/DROP TABLE IF EXISTS .+ CASCADE;\n?/g, "")
    .replace(/DROP INDEX IF EXISTS .+;\n?/g, "");

  db.public.none(cleanSchema);

  pool = {
    query: (text, params) => {
      try {
        if (params && params.length > 0) {
          const result = db.public.query(text, params);
          return { rows: result.rows || [], rowCount: result.rows?.length || 0 };
        }
        const result = db.public.query(text);
        return { rows: result.rows || [], rowCount: result.rows?.length || 0 };
      } catch (err) {
        throw err;
      }
    },
    end: () => {},
  };
}

export default pool;
