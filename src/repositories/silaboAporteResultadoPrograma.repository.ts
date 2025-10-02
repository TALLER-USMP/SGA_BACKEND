import { eq, and } from "drizzle-orm";
import { getDb } from "../db/index";
import { silaboAporteResultadoPrograma } from "../../drizzle/schema";

export class SilaboAporteResultadoProgramaRepository {
  private db = getDb();

  // Actualiza un aporte usando la clave compuesta (silaboId + codigo)
  async updateBySilaboIdAndCodigo(
    silaboId: number,
    codigo: string,
    data: {
      resultadoProgramaDescripcion?: string | null;
      aporteValor?: "K" | "R" | null; // ahora restringido a K o R
    },
  ) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const result = await this.db
      .update(silaboAporteResultadoPrograma)
      .set({
        resultadoProgramaDescripcion: data.resultadoProgramaDescripcion,
        aporteValor: data.aporteValor,
      })
      .where(
        and(
          eq(silaboAporteResultadoPrograma.silaboId, silaboId),
          eq(silaboAporteResultadoPrograma.resultadoProgramaCodigo, codigo),
        ),
      )
      .returning();

    return result.length ? result[0] : null;
  }
}
