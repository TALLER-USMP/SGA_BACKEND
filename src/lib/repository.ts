import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle/schema";
import { getDb } from "../db";
import { AppError } from "../error";

export abstract class BaseRepository {
  protected db: NodePgDatabase<typeof schema>;
  constructor() {
    const database = getDb();
    if (!database) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "No se pudo conectar a la base de datos",
      );
    }
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }
}
