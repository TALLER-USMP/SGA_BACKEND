import { getDb } from "../../db";
import { silabo, silaboDocente } from "../../../drizzle/schema";
import { ilike, eq, and, asc, is } from "drizzle-orm";
import type { SilaboListItem, SilaboFilters } from "./types";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import { id } from "zod/v4/locales/index.cjs";

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

      if (filters?.estadoRevision?.trim()) {
        conditions.push(
          eq(silabo.estadoRevision, filters.estadoRevision.trim()),
        );
      }

      const query = this.db
        .select({
          cursoCodigo: silabo.cursoCodigo,
          cursoNombre: silabo.cursoNombre,
          estadoRevision: silabo.estadoRevision,
          syllabusId: silabo.id,
          docenteId: silaboDocente.docenteId,
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

  async getByStatus(
    idDocente: string,
    estadoRevision: string,
  ): Promise<SilaboListItem[]> {
    try {
      const idDocenteNum = Number(idDocente);

      if (isNaN(idDocenteNum) || idDocenteNum <= 0) {
        throw new AppError(
          "ValidationError",
          "BAD_REQUEST",
          "El idDocente debe ser un número válido mayor que cero",
        );
      }
      const result = await this.db
        .select({
          cursoCodigo: silabo.cursoCodigo,
          cursoNombre: silabo.cursoNombre,
          estadoRevision: silabo.estadoRevision,
          syllabusId: silabo.id,
          docenteId: silaboDocente.docenteId,
        })
        .from(silabo)
        .innerJoin(silaboDocente, eq(silabo.id, silaboDocente.silaboId))
        .where(
          and(
            eq(silaboDocente.docenteId, idDocenteNum),
            eq(silabo.estadoRevision, estadoRevision),
          ),
        )
        .orderBy(asc(silabo.cursoCodigo));

      return result.map((r) => ({
        cursoCodigo: r.cursoCodigo ?? null,
        cursoNombre: r.cursoNombre ?? null,
        estadoRevision: r.estadoRevision ?? null,
        syllabusId: r.syllabusId,
        docenteId: r.docenteId ?? null,
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
