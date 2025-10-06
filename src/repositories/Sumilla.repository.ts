// src/repositories/silaboSumilla.repository.ts
import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";

export class SilaboSumillaRepository {
  private db = getDb();

  /**
   
   * @param silaboId ID del sílabo (tabla silabo.id)
   * @param nuevaSumilla Texto de la sumilla
   * @returns La fila actualizada o null si no existe
   */
  async updateSumillaBySilaboId(silaboId: number, nuevaSumilla: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    // Si en tu schema Drizzle mapea "updated_at" -> "updatedAt", esto lo mantiene fresco.
    const [updated] = await this.db
      .update(silabo)
      .set({
        sumilla: nuevaSumilla,
        // Quita esta línea si tu schema no tiene el alias camelCase:
        // updatedAt: new Date(),
      })
      .where(eq(silabo.id, silaboId))
      .returning();

    return updated ?? null;
  }
}
