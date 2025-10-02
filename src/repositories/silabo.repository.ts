import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";

export class SilaboRepository {
  private db = getDb();

  // Método para actualizar recursos didácticos

  async updateRecursosDidacticos(id: number, recursos: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const [updated] = await this.db
      .update(silabo)
      .set({
        recursosDidacticos: recursos,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(silabo.id, id))
      .returning();

    return updated || null;
  }
}
