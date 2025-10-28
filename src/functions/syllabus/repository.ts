import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import {
  silaboCompetenciaCurso,
  silaboCompetenciaComponente,
  silabo,
  silaboDocente,
  docente,
} from "../../../drizzle/schema";
import { AppError } from "../../error";
import { z } from "zod";
import { SyllabusCreateSchema } from "./types";

//1
type Upsertable = { id?: number | string; text: string; order?: number | null };
type CreateItem = { text: string; order?: number | null; code?: string | null };

const GROUP_COMP = "COMP";
const GROUP_ACT = "ACT";

function getDbOrThrow(): NodePgDatabase<typeof schema> {
  const db = getDb() as unknown;
  if (!db)
    throw new AppError(
      "DbConnectionError",
      "INTERNAL_SERVER_ERROR",
      "DB no inicializada",
    );
  return db as NodePgDatabase<typeof schema>;
}

export class SyllabusRepository {
  //---------- DATOS GENERALES (silabo) ----------
  async findGeneralDataById(id: number) {
    const db = getDbOrThrow();
    if (!db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    const silaboResult = await db
      .select({
        nombreAsignatura: silabo.cursoNombre,
        departamentoAcademico: silabo.departamentoAcademico,
        escuelaProfesional: silabo.escuelaProfesional,
        programaAcademico: silabo.programaAcademico,
        semestreAcademico: silabo.semestreAcademico,
        tipoAsignatura: silabo.tipoAsignatura,
        tipoEstudios: silabo.tipoDeEstudios,
        modalidad: silabo.modalidadDeAsignatura,
        codigoAsignatura: silabo.cursoCodigo,
        ciclo: silabo.ciclo,
        requisitos: silabo.requisitos,
        horasTeoria: silabo.horasTeoria,
        horasPractica: silabo.horasPractica,
        horasLaboratorio: silabo.horasLaboratorio,
        horasTeoriaLectivaPresencial: silabo.horasTeoriaLectivaPresencial,
        horasTeoriaLectivaDistancia: silabo.horasTeoriaLectivaDistancia,
        horasTeoriaNoLectivaPresencial: silabo.horasTeoriaNoLectivaPresencial,
        horasTeoriaNoLectivaDistancia: silabo.horasTeoriaNoLectivaDistancia,
        horasPracticaLectivaPresencial: silabo.horasPracticaLectivaPresencial,
        horasPracticaLectivaDistancia: silabo.horasPracticaLectivaDistancia,
        horasPracticaNoLectivaPresencial:
          silabo.horasPracticaNoLectivaPresencial,
        horasPracticaNoLectivaDistancia: silabo.horasPracticaNoLectivaDistancia,
        creditosTeoria: silabo.creditosTeoria,
        creditosPractica: silabo.creditosPractica,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    const docentes = await db
      .select({ nombreDocente: docente.nombreDocente })
      .from(silaboDocente)
      .innerJoin(docente, eq(silaboDocente.docenteId, docente.id))
      .where(eq(silaboDocente.silaboId, id));

    const docentesNombres = docentes.map((d) => d.nombreDocente);
    const docentesString =
      docentesNombres.length === 1
        ? docentesNombres[0]
        : docentesNombres.join(", ");

    return {
      ...silaboResult[0],
      docentes: docentesString,
    };
  }

  async create(syllabusData: z.infer<typeof SyllabusCreateSchema>) {
    const db = getDbOrThrow();
    if (!db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    const result = await db
      .insert(silabo)
      .values({
        departamentoAcademico: syllabusData.departamentoAcademico,
        escuelaProfesional: syllabusData.escuelaProfesional,
        programaAcademico: syllabusData.programaAcademico,
        cursoCodigo: syllabusData.codigoAsignatura,
        cursoNombre: syllabusData.nombreAsignatura,
        semestreAcademico: syllabusData.semestreAcademico,
        tipoAsignatura: syllabusData.tipoAsignatura,
        tipoDeEstudios: syllabusData.tipoEstudios,
        modalidadDeAsignatura: syllabusData.modalidad,
        ciclo: syllabusData.ciclo,

        requisitos: syllabusData.requisitos || null,

        // 🕒 Horas
        horasTeoria: syllabusData.horasTeoria ?? null,
        horasPractica: syllabusData.horasPractica ?? null,
        horasLaboratorio: syllabusData.horasLaboratorio ?? null,

        horasTeoriaLectivaPresencial:
          syllabusData.horasTeoriaLectivaPresencial ?? null,
        horasTeoriaLectivaDistancia:
          syllabusData.horasTeoriaLectivaDistancia ?? null,
        horasTeoriaNoLectivaPresencial:
          syllabusData.horasTeoriaNoLectivaPresencial ?? null,
        horasTeoriaNoLectivaDistancia:
          syllabusData.horasTeoriaNoLectivaDistancia ?? null,

        horasPracticaLectivaPresencial:
          syllabusData.horasPracticaLectivaPresencial ?? null,
        horasPracticaLectivaDistancia:
          syllabusData.horasPracticaLectivaDistancia ?? null,
        horasPracticaNoLectivaPresencial:
          syllabusData.horasPracticaNoLectivaPresencial ?? null,
        horasPracticaNoLectivaDistancia:
          syllabusData.horasPracticaNoLectivaDistancia ?? null,

        // 🧮 Créditos
        creditosTeoria: syllabusData.creditosTeoria ?? null,
        creditosPractica: syllabusData.creditosPractica ?? null,

        // 👤 Relaciones (null por ahora, hasta integrar autenticación)
        creadoPorDocenteId: null,
        actualizadoPorDocenteId: null,
        asignadoADocenteId: null,

        // 🟢 Estado inicial por defecto
        estadoRevision: "",
      })
      .returning({ id: silabo.id });

    //const idSyllabus = [{ id: 1 }]; // simula el ID retornado

    return result[0].id;
  }

  async updateSumilla(id: number, sumilla: string) {
    const db = getDbOrThrow();
    if (!db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    await db
      .update(silabo)
      .set({
        //sumilla,
        updatedAt: new Date().toISOString(),
      } as any)
      .where(eq(silabo.id, id));
  }

  // ---------- COMPETENCIAS (silabo_competencia_curso) ----------
  listCompetencies(syllabusId: number | string) {
    const db = getDbOrThrow();
    return db
      .select({
        id: silaboCompetenciaCurso.id,
        silaboId: silaboCompetenciaCurso.silaboId,
        text: silaboCompetenciaCurso.descripcion,
        code: silaboCompetenciaCurso.codigo,
        order: silaboCompetenciaCurso.orden,
      })
      .from(silaboCompetenciaCurso)
      .where(eq(silaboCompetenciaCurso.silaboId, Number(syllabusId)));
  }

  async insertCompetencies(
    syllabusId: number | string,
    items: { text: string; code: string | null; order: number | null }[],
  ) {
    const db = getDbOrThrow();
    for (const it of items) {
      await db.insert(silaboCompetenciaCurso).values({
        silaboId: Number(syllabusId),
        descripcion: it.text,
        codigo: it.code ?? null,
        orden: it.order ?? null,
      });
    }
    return { inserted: items.length };
  }

  async deleteCompetency(syllabusId: number | string, id: number | string) {
    const db = getDbOrThrow();
    const res = await db
      .delete(silaboCompetenciaCurso)
      .where(
        and(
          eq(silaboCompetenciaCurso.id, Number(id)),
          eq(silaboCompetenciaCurso.silaboId, Number(syllabusId)),
        ),
      );
    return { deleted: (res as unknown as { rowCount?: number }).rowCount ?? 0 };
  }

  // ---------- COMPONENTES (silabo_competencia_componente.grupo='COMP') ----------
  async listComponents(syllabusId: number) {
    const db = getDbOrThrow();
    return db
      .select()
      .from(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.silaboId, syllabusId),
          eq(silaboCompetenciaComponente.grupo, GROUP_COMP),
        ),
      )
      .orderBy(silaboCompetenciaComponente.orden);
  }

  async insertComponents(syllabusId: number, items: CreateItem[]) {
    const db = getDbOrThrow();
    for (const it of items) {
      await db.insert(silaboCompetenciaComponente).values({
        silaboId: syllabusId,
        grupo: GROUP_COMP,
        descripcion: it.text,
        codigo: it.code ?? null,
        orden: it.order ?? null,
      });
    }
    return { inserted: items.length };
  }

  async deleteComponent(syllabusId: number, id: number) {
    const db = getDbOrThrow();
    const res = await db
      .delete(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.id, id),
          eq(silaboCompetenciaComponente.silaboId, syllabusId),
          eq(silaboCompetenciaComponente.grupo, GROUP_COMP),
        ),
      );
    return { deleted: (res as unknown as { rowCount?: number }).rowCount ?? 0 };
  }

  // ---------- ACTITUDES (silabo_competencia_componente.grupo='ACT') ----------
  async listAttitudes(syllabusId: number) {
    const db = getDbOrThrow();
    return db
      .select()
      .from(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.silaboId, syllabusId),
          eq(silaboCompetenciaComponente.grupo, GROUP_ACT),
        ),
      )
      .orderBy(silaboCompetenciaComponente.orden);
  }

  async insertAttitudes(syllabusId: number, items: CreateItem[]) {
    const db = getDbOrThrow();
    for (const it of items) {
      await db.insert(silaboCompetenciaComponente).values({
        silaboId: syllabusId,
        grupo: GROUP_ACT,
        descripcion: it.text,
        codigo: it.code ?? null,
        orden: it.order ?? null,
      });
    }
    return { inserted: items.length };
  }

  async deleteAttitude(syllabusId: number, id: number) {
    const db = getDbOrThrow();
    const res = await db
      .delete(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.id, id),
          eq(silaboCompetenciaComponente.silaboId, syllabusId),
          eq(silaboCompetenciaComponente.grupo, GROUP_ACT),
        ),
      );
    return { deleted: (res as unknown as { rowCount?: number }).rowCount ?? 0 };
  }

  // Obtener estrategias metodológicas por ID
  async getEstrategiasMetodologicas(id: number) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .select({
        id: schema.silabo.id,
        estrategiasMetodologicas: schema.silabo.estrategiasMetodologicas,
      })
      .from(schema.silabo)
      .where(eq(schema.silabo.id, id));

    return result[0] ?? null;
  }

  // Obtener recursos didácticos por ID
  async getRecursosDidacticosNotas(id: number) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .select({
        id: schema.silabo.id,
        recursosDidacticosNotas: schema.silabo.recursosDidacticosNotas,
      })
      .from(schema.silabo)
      .where(eq(schema.silabo.id, id));

    return result[0] ?? null;
  }

  // Obtener evaluación por ID
  async getEvaluacion(id: number) {
    const db = getDb();
    if (!db) return null;

    // 1️⃣ Obtener la regla principal
    const regla = await db
      .select({
        id: schema.formulaEvaluacionRegla.id,
        silaboId: schema.formulaEvaluacionRegla.silaboId,
        variableFinalCodigo: schema.formulaEvaluacionRegla.variableFinalCodigo,
        expresionFinal: schema.formulaEvaluacionRegla.expresionFinal,
      })
      .from(schema.formulaEvaluacionRegla)
      .where(eq(schema.formulaEvaluacionRegla.id, id));

    if (!regla[0]) return null;
    const reglaData = regla[0];

    // 2️⃣ Obtener las subformulas asociadas a esa regla
    const subformula = await db
      .select({
        variableCodigo: schema.formulaEvaluacionSubformula.variableCodigo,
        expresion: schema.formulaEvaluacionSubformula.expresion,
      })
      .from(schema.formulaEvaluacionSubformula)
      .where(
        eq(schema.formulaEvaluacionSubformula.formulaEvaluacionReglaId, id),
      );

    return { regla: reglaData, subformula };
  }

  // Actualizar estrategias metodológicas por ID
  async putEstrategiasMetodologicas(id: number, estrategias: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .update(schema.silabo)
      .set({ estrategiasMetodologicas: estrategias })
      .where(eq(schema.silabo.id, id))
      .returning({ id: schema.silabo.id });

    return result[0] ?? null;
  }

  // Actualizar recursos didácticos por ID
  async putRecursosDidacticosNotas(id: number, recursos: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .update(schema.silabo)
      .set({ recursosDidacticosNotas: recursos })
      .where(eq(schema.silabo.id, id))
      .returning({ id: schema.silabo.id });

    return result[0] ?? null;
  }

  // Crear estrategias metodológicas
  async postEstrategiasMetodologicas(estrategias: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .insert(schema.silabo)
      .values({
        estrategiasMetodologicas: estrategias,
      })
      .returning({
        id: schema.silabo.id,
        estrategiasMetodologicas: schema.silabo.estrategiasMetodologicas,
      });

    return result[0] ?? null;
  }

  // Crear recursos didácticos
  async postRecursosDidacticosNotas(recursos: string) {
    const db = getDb();
    if (!db) return null;

    const result = await db
      .insert(schema.silabo)
      .values({
        recursosDidacticosNotas: recursos,
      })
      .returning({
        id: schema.silabo.id,
        recursosDidacticosNotas: schema.silabo.recursosDidacticosNotas,
      });

    return result[0] ?? null;
  }

  async getStateById(id: number) {
    const db = getDbOrThrow();
    const result = await db
      .select({
        estadoRevision: silabo.estadoRevision,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    return result[0] || null;
  }

  async updateReviewStatus(id: number, estadoRevision: string) {
    const db = getDbOrThrow();
    await db
      .update(silabo)
      .set({
        estadoRevision,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(silabo.id, id));
    return { ok: true };
  }

  async createContribution(data: {
    syllabusId: number;
    resultadoProgramaCodigo: string;
    resultadoProgramaDescripcion?: string;
    aporteValor: "" | "K" | "R";
  }) {
    const db = getDbOrThrow();
    const result = await db
      .insert(schema.silaboAporteResultadoPrograma)
      .values({
        silaboId: data.syllabusId,
        resultadoProgramaCodigo: data.resultadoProgramaCodigo,
        resultadoProgramaDescripcion: data.resultadoProgramaDescripcion,
        aporteValor: data.aporteValor,
      })
      .returning();

    return result[0];
  }
}

export const syllabusRepository = new SyllabusRepository();
