import fs from "fs";
import path from "path";
import pool from "./connection.js";

const schemaPath = path.join(process.cwd(), "src", "db", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

async function migrate() {
  try {
    await pool.query(schema);
    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await pool.end();
  }
}

migrate();