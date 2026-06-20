import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool;

if (process.env.DATABASE_URL && !process.env.USE_MEMORY_DB) {
  const pkg = await import("pg");
  const { Pool } = pkg.default || pkg;
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  const { newDb } = await import("pg-mem");

  const schemaPath = path.join(__dirname, "schema-pgmem.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  const db = newDb();
  db.public.none(schema);

  // Apply default data (hub_profiles for everyone etc.)
  // No default data needed - registration will create users

  pool = {
    query: (text, params) => {
      // Replace $1, $2 etc. with escaped values since pg-mem
      // doesn't support parameterized queries in the standard way
      let sql = text;
      if (params && params.length > 0) {
        sql = text.replace(/\$(\d+)/g, (_, num) => {
          const val = params[parseInt(num) - 1];
          if (val === null || val === undefined) return "NULL";
          if (typeof val === "number") return String(val);
          if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
          return "'" + String(val).replace(/'/g, "''") + "'";
        });
      }
      // console.log("[pg-mem]", sql.substring(0, 200));

      const result = db.public.query(sql);
      return { rows: result.rows || [], rowCount: result.rows?.length || 0 };
    },
    end: () => {},
  };
}

export default pool;
