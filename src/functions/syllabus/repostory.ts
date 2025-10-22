import { eq } from "drizzle-orm";
import { getDb } from "../../db/index";
import { silabo } from "../../../drizzle/schema";

class SyllabusRepository {
  private db = getDb();

  // Obtener estrategias metodológicas por ID
  async getEstrategiasMetodologicas(id: number) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const result = await this.db
      .select({ estrategias_metodologicas: silabo.estrategiasMetodologicas })
      .from(silabo)
      .where(eq(silabo.id, id));

    return result[0];
  }

  // Crear estrategias metodológicas
  async postEstrategiasMetodologicas(estrategias: string) {
    if (!this.db) throw new Error("No se pudo conectar a la base de datos");

    const result = await this.db
      .insert(silabo)
      .values({
        estrategiasMetodologicas: estrategias,
      })
      .returning({
        id: silabo.id,
        estrategiasMetodologicas: silabo.estrategiasMetodologicas,
      });

    return result[0];
  }
}

export const syllabusRepository = new SyllabusRepository();
