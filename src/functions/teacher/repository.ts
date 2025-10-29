import { getDb } from "../../db";
import { eq } from "drizzle-orm";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";

export class DocenteRepository {
  /** Obtiene el perfil de un docente por su ID */
  async findByDocenteId(docenteId: number) {
    const db = (await getDb()) as any;
    if (!db) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    }

    const rows = await db
      .select({
        nombre: schema.docente.nombreDocente,
        correo: schema.docente.correo,
        gradoCatalogo: schema.gradoAcademicoCatalogo.nombre,
        gradoTexto: schema.docente.gradoAcademico,
      })
      .from(schema.docente)
      .leftJoin(
        schema.gradoAcademicoCatalogo,
        eq(schema.docente.gradoAcademicoId, schema.gradoAcademicoCatalogo.id),
      )
      .where(eq(schema.docente.id, docenteId))
      .limit(1);

    const r = rows[0];
    if (!r) return null;

    return {
      nombre: r.nombre ?? null,
      correo: r.correo ?? null,
      grado: r.gradoTexto ?? r.gradoCatalogo ?? null,
      apellido: null,
      bachiller: null,
    };
  }

  /** Actualiza el perfil de un docente por su ID */
  async updateByDocenteId(
    docenteId: number,
    data: {
      nombre?: string;
      gradoAcademicoId?: number;
      grado?: string;
      correo?: string;
    },
  ) {
    const db = (await getDb()) as any;
    if (!db) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    }

    // Usa el tipo inferido del insert/update para no equivocarte con los nombres.
    const setObj: Partial<typeof schema.docente.$inferInsert> = {};

    if (data.nombre !== undefined) {
      setObj.nombreDocente = data.nombre; // columna: nombre_docente
    }

    if (data.grado !== undefined) {
      setObj.gradoAcademico = data.grado; // columna: grado_academico
      setObj.gradoAcademicoId = null; // columna: grado_academico_id
    }

    if (data.gradoAcademicoId !== undefined && data.grado === undefined) {
      setObj.gradoAcademicoId = data.gradoAcademicoId;
    }

    if (data.correo !== undefined) {
      setObj.correo = data.correo;
    }
    if (
      setObj.nombreDocente === undefined &&
      setObj.gradoAcademico === undefined &&
      setObj.gradoAcademicoId === undefined &&
      setObj.correo === undefined
    ) {
      return this.findByDocenteId(docenteId);
    }

    await db
      .update(schema.docente)
      .set(setObj)
      .where(eq(schema.docente.id, docenteId));

    const after = await db
      .select({
        nombre: schema.docente.nombreDocente,
        correo: schema.docente.correo,
        gradoCatalogo: schema.gradoAcademicoCatalogo.nombre,
        gradoTexto: schema.docente.gradoAcademico,
      })
      .from(schema.docente)
      .leftJoin(
        schema.gradoAcademicoCatalogo,
        eq(schema.docente.gradoAcademicoId, schema.gradoAcademicoCatalogo.id),
      )
      .where(eq(schema.docente.id, docenteId))
      .limit(1);

    const r = after[0];
    if (!r) return null;

    return {
      nombre: r.nombre ?? null,
      correo: r.correo ?? null,
      grado: r.gradoTexto ?? r.gradoCatalogo ?? null,
      apellido: null,
      bachiller: null,
    };
  }
}

export const docenteRepository = new DocenteRepository();
