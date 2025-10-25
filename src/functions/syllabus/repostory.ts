import { eq } from "drizzle-orm";
import { getDb } from "../../db/index";
import { silabo } from "../../../drizzle/schema";

class SyllabusRepository {
  // Obtener estrategias metodológicas por ID
  async getEstrategiasMetodologicas(id: number) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .select({
        id: silabo.id,
        estrategiasMetodologicas: silabo.estrategiasMetodologicas,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    return result[0] ?? null;
  }

  // Obtener recursos didácticos por ID
  async getRecursosDidacticos(id: number) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .select({
        id: silabo.id,
        recursosDidacticos: silabo.recursosDidacticos,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    return result[0] ?? null;
  }

  // Crear estrategias metodológicas
  async postEstrategiasMetodologicas(estrategias: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .insert(silabo)
      .values({
        estrategiasMetodologicas: estrategias,
      })
      .returning({
        id: silabo.id,
        estrategiasMetodologicas: silabo.estrategiasMetodologicas,
      });

    return result[0] ?? null;
  }

  // Crear recursos didácticos
  async postRecursosDidacticos(recursos: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .insert(silabo)
      .values({
        recursosDidacticos: recursos,
      })
      .returning({
        id: silabo.id,
        recursosDidacticos: silabo.recursosDidacticos,
      });

    return result[0] ?? null;
  }
}

export const syllabusRepository = new SyllabusRepository();
