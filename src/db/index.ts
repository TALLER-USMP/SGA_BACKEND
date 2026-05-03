import "dotenv/config";
import { AppError } from "../error";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

let pool: Pool | null = null;

function shouldUseSsl(connectionString: string) {
  const sslMode = process.env.DATABASE_SSL?.toLowerCase();

  if (sslMode === "false" || sslMode === "disable") {
    return false;
  }

  if (sslMode === "true" || sslMode === "require") {
    return { rejectUnauthorized: false };
  }

  if (/localhost|127\.0\.0\.1/i.test(connectionString)) {
    return false;
  }

  return { rejectUnauthorized: false };
}

export function getDb() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new AppError(
        "DatabaseConfigError",
        "INTERNAL_SERVER_ERROR",
        "DATABASE_URL no está configurado",
      );
    }

    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: shouldUseSsl(process.env.DATABASE_URL),
      });
    }

    return drizzle(pool);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new AppError(
        error.name,
        "INTERNAL_SERVER_ERROR",
        "No se pudo conectar a la base de datos",
      );
    }

    throw new AppError(
      "DatabaseError",
      "INTERNAL_SERVER_ERROR",
      "No se pudo conectar a la base de datos",
    );
  }
}
