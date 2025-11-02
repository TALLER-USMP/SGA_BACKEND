import { getDb } from "../../db";
import { eq, isNotNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";

export class TeacherRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    const database = getDb();
    if (!database) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    }
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }

  /** Lista todos los docentes activos con sus categorías */
  async findAll() {
    const rows = await this.db
      .select({
        id: schema.docente.id,
        nombre: schema.docente.nombreDocente,
        correo: schema.docente.correo,
        gradoCatalogo: schema.gradoAcademicoCatalogo.nombre,
        gradoTexto: schema.docente.gradoAcademico,
        categoria: schema.categoriaUsuario.nombreCategoria,
        categoriaId: schema.categoriaUsuario.id,
        activo: schema.docente.activo,
        ultimoAcceso: schema.docente.ultimoAccesoEn,
      })
      .from(schema.docente)
      .leftJoin(
        schema.gradoAcademicoCatalogo,
        eq(schema.docente.gradoAcademicoId, schema.gradoAcademicoCatalogo.id),
      )
      .leftJoin(
        schema.categoriaUsuario,
        eq(schema.docente.categoriaUsuarioId, schema.categoriaUsuario.id),
      )
      .where(eq(schema.docente.activo, true));

    return rows.map((r: any) => ({
      id: r.id,
      nombre: r.nombre ?? null,
      correo: r.correo,
      grado: r.gradoTexto ?? r.gradoCatalogo ?? null,
      categoria: r.categoria ?? null,
      categoriaId: r.categoriaId,
      activo: r.activo ?? true,
      ultimoAcceso: r.ultimoAcceso ?? null,
    }));
  }

  /** Obtiene el perfil de un docente por su ID */
  async findById(docenteId: number) {
    const rows = await this.db
      .select({
        id: schema.docente.id,
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
      id: r.id,
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
      return this.findById(docenteId);
    }

    await this.db
      .update(schema.docente)
      .set(setObj)
      .where(eq(schema.docente.id, docenteId));

    const after = await this.db
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

export const teacherRepository = new TeacherRepository();
