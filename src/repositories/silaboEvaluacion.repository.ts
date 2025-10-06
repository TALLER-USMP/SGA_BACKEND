// src/repositories/silaboEvaluacion.repository.ts
import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silaboEvaluacion } from "../../drizzle/schema";

export class SilaboEvaluacionRepository {
  private db = getDb();

  // Actualiza la evaluación según el silaboId
  async updateBySilaboId(
    silaboId: number,
    data: Partial<typeof silaboEvaluacion>,
  ) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const result = await this.db
      .update(silaboEvaluacion)
      .set({
        componenteNombre: data.componenteNombre,
        descripcion: data.descripcion,
        instrumentoNombre: data.instrumentoNombre,
        criterios: data.criterios,
        ponderacion: data.ponderacion,
        semana: data.semana,
        minimoAprobatorio: data.minimoAprobatorio,
      })
      .where(eq(silaboEvaluacion.silaboId, silaboId))
      .returning();

    return result.length ? result[0] : null;
  }
}
