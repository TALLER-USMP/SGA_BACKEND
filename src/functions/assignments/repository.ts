import { getDb } from "../../db";
import { silabo, silaboDocente } from "../../../drizzle/schema";
import { ilike, eq, and, asc } from "drizzle-orm";
import type { SilaboListItem, SilaboFilters } from "./types";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";

class AssignmentsRepository {
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

  async getAll(filters?: SilaboFilters): Promise<SilaboListItem[]> {
    try {
      const conditions: any[] = [];

      // Construir condiciones de filtrado
      if (filters?.codigo?.trim()) {
        conditions.push(
          ilike(silabo.cursoCodigo, `%${filters.codigo.trim()}%`),
        );
      }

      if (filters?.nombre?.trim()) {
        conditions.push(
          ilike(silabo.cursoNombre, `%${filters.nombre.trim()}%`),
        );
      }

      if (filters?.idSilabo !== undefined) {
        conditions.push(eq(silabo.id, filters.idSilabo));
      }

      if (filters?.idDocente !== undefined) {
        conditions.push(eq(silaboDocente.docenteId, filters.idDocente));
      }
      if (filters?.areaCurricular !== undefined) {
        conditions.push(eq(silabo.areaCurricular, filters.areaCurricular));
      }

      const query = this.db
        .select({
          cursoCodigo: silabo.cursoCodigo,
          cursoNombre: silabo.cursoNombre,
          estadoRevision: silabo.estadoRevision,
          syllabusId: silabo.id,
          docenteId: silaboDocente.docenteId,
          areaCurricular: silabo.areaCurricular,
        })
        .from(silabo)
        .innerJoin(silaboDocente, eq(silabo.id, silaboDocente.silaboId));

      if (conditions.length > 0) {
        query.where(
          conditions.length === 1 ? conditions[0] : and(...conditions),
        );
      }

      query.orderBy(asc(silabo.cursoCodigo));

      const result = await query;

      return result.map((r) => ({
        cursoCodigo: r.cursoCodigo ?? null,
        cursoNombre: r.cursoNombre ?? null,
        estadoRevision: r.estadoRevision ?? null,
        syllabusId: r.syllabusId,
        docenteId: r.docenteId ?? null,
        areaCurricular: r.areaCurricular ?? null,
      }));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Error al consultar sílabos en la base de datos",
        error,
      );
    }
  }
}

export const SilaboRepository = new AssignmentsRepository();
