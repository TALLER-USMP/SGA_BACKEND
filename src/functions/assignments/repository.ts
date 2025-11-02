import { and, asc, eq, ilike } from "drizzle-orm";
import { silabo, silaboDocente, docente } from "../../../drizzle/schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { getDb } from "../../db";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import { BaseRepository } from "../../lib/repository";
import type {
  CreateAssignmentPayload,
  SilaboFilters,
  SilaboListItem,
} from "./types";

class AssignmentsRepository extends BaseRepository {
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
        conditions.push(eq(silabo.id, Number(filters.idSilabo)));
      }

      if (filters?.idDocente !== undefined) {
        conditions.push(eq(silaboDocente.docenteId, Number(filters.idDocente)));
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
          nombreDocente: docente.nombreDocente,
          areaCurricular: silabo.areaCurricular,
        })
        .from(silabo)
        .innerJoin(silaboDocente, eq(silabo.id, silaboDocente.silaboId))
        .innerJoin(docente, eq(silaboDocente.docenteId, docente.id));

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
        nombreDocente: r.nombreDocente ?? null,
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

  async create(assigment: CreateAssignmentPayload) {
    return await this.db.transaction((transaction) => {
      return transaction
        .insert(silaboDocente)
        .values({
          silaboId: assigment.syllabus.id,
          docenteId: assigment.teacher.id,
          rol: "asignado",
          observaciones: assigment.message,
        })
        .returning();
    });
  }
}

export const assignmentsRepository = new AssignmentsRepository();
