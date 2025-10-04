import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silaboFuente } from "../../drizzle/schema";

export class SilaboFuenteRepository {
  private db = getDb();

  /**
   * @param id ID de la fuente
   * @param data Campos a actualizar
   */
  async updateFuente(
    id: number,
    data: Partial<typeof silaboFuente.$inferInsert>,
  ) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    delete (data as any).id;

    const [updated] = await this.db
      .update(silaboFuente)
      .set(data)
      .where(eq(silaboFuente.id, id))
      .returning();

    return updated || null;
  }
}
