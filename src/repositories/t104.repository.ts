import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";

export class T56Repository {
  private db = getDb();

  // Método para actualizar estrategias metodológicas

  async updateEstrategiasMetodologicas(id: number, estrategias: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const [updated] = await this.db
      .update(silabo)
      .set({
        estrategiasMetodologicas: estrategias,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(silabo.id, id))
      .returning();

    return updated || null;
  }
}
