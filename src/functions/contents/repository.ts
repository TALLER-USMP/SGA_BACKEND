import { getDb } from "../../db";
import { silabo, silaboUnidad } from "../../../drizzle/schema";
import { eq, asc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import type { UnidadListItem } from "./types";

class ContentsRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    const database = getDb();
    if (!database) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "No se pudo obtener la conexión a la base de datos",
      );
    }
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }

  /**
   * 🔍 Obtiene todas las unidades de un curso usando JOIN entre silabo y silabo_unidad
   */
  async getUnidadesByCursoCodigo(
    cursoCodigo: string,
  ): Promise<UnidadListItem[]> {
    try {
      const result = await this.db
        .select({
          id: silaboUnidad.id,
          numero: silaboUnidad.numero,
          titulo: silaboUnidad.titulo,
          semanaInicio: silaboUnidad.semanaInicio,
          semanaFin: silaboUnidad.semanaFin,
          actividadesAprendizaje: silaboUnidad.actividadesAprendizaje,
        })
        .from(silaboUnidad)
        .innerJoin(silabo, eq(silaboUnidad.silaboId, silabo.id))
        .where(eq(silabo.cursoCodigo, cursoCodigo))
        .orderBy(asc(silaboUnidad.numero));

      if (result.length === 0) {
        throw new AppError(
          "NotFoundError",
          "NOT_FOUND",
          `No se encontraron unidades para el cursoCodigo: ${cursoCodigo}`,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Error al consultar las unidades en la base de datos",
        error,
      );
    }
  }
}

export const contentsRepository = new ContentsRepository();
