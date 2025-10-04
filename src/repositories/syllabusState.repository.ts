import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";
import { log } from "console";

export class SyllabusStateRepository {
  private db = getDb();

  async findById(id: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const numericIdSilabo = Number(id);

    log("ESTE ES EL ID" + numericIdSilabo);
    const stateSyllable = await this.db
      .select(/*estado*/) // <- aqui corresponde el campo estado de la tabla
      .from(silabo)
      .where(eq(silabo.id, numericIdSilabo));

    return stateSyllable ? stateSyllable : null;
  }
}
