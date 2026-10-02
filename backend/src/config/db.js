import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing. Add it to backend/.env before starting the app."
  );
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("supabase.co")
    ? { rejectUnauthorized: false }
    : false,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

export default pool;