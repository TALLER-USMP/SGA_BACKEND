import { getDb } from "../../db";
import { eq, and, sql, asc } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import {
  silaboCompetenciaCurso,
  silaboCompetenciaComponente,
  silabo,
  silaboDocente,
  docente,
  silaboSumilla,
  silaboRevisionSeccion,
  silaboSeccionPermiso,
} from "../../../drizzle/schema";
import { AppError } from "../../error";
import { z } from "zod";
import { SyllabusCreateSchema } from "./types";
import { BaseRepository } from "../../lib/repository";

//1
type Upsertable = { id?: number | string; text: string; order?: number | null };
type CreateItem = { text: string; order?: number | null; code?: string | null };

const GROUP_COMP = "COMP";
const GROUP_ACT = "ACT";

export class SyllabusRepository extends BaseRepository {
  async findById(id: number) {
    const syllabus = await this.db
      .select()
      .from(silabo)
      .where(eq(silabo.id, id));
    return syllabus[0] || null;
  }

  async findGeneralDataById(id: number) {
    const silaboResult = await this.db
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

    if (!silaboResult || silaboResult.length === 0) {
      return null;
    }

    const docentes = await this.db
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
    const result = await this.db
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

  async updateSumilla(silaboId: number, sumilla: string) {
    await this.db
      .update(silaboSumilla)
      .set({
        //sumilla,
        contenido: sumilla,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(silaboSumilla.silaboId, silaboId));
  }

  async saveSumilla(silaboId: number, sumilla: string) {
    await this.db.insert(silaboSumilla).values({
      silaboId: silaboId,
      contenido: sumilla,
      es_actual: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any);
  }

  async findSumillaBySilaboId(silaboId: number) {
    return await this.db
      .select({
        sumilla: silaboSumilla.contenido,
      })
      .from(silaboSumilla)
      .where(eq(silaboSumilla.silaboId, silaboId))
      .limit(1);
  }

  // ---------- COMPETENCIAS (silabo_competencia_curso) ----------
  listCompetencies(syllabusId: number | string) {
    return this.db
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
    for (const it of items) {
      await this.db.insert(silaboCompetenciaCurso).values({
        silaboId: Number(syllabusId),
        descripcion: it.text,
        codigo: it.code ?? null,
        orden: it.order ?? null,
      });
    }
    return { inserted: items.length };
  }

  async deleteCompetency(syllabusId: number | string, id: number | string) {
    const res = await this.db
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
    return this.db
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
    for (const it of items) {
      await this.db.insert(silaboCompetenciaComponente).values({
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
    const res = await this.db
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
    return this.db
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
    for (const it of items) {
      await this.db.insert(silaboCompetenciaComponente).values({
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
    const res = await this.db
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

  async getStateById(id: number) {
    const result = await this.db
      .select({
        estadoRevision: silabo.estadoRevision,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    return result[0] || null;
  }

  async updateReviewStatus(id: number, estadoRevision: string) {
    await this.db
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
    const result = await this.db
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

  // ---------- OBTENER SÍLABO COMPLETO ----------
  async getCompleteSyllabus(id: number) {
    // 1. Datos Generales - Verificar que el sílabo existe
    const datosGenerales = await this.findGeneralDataById(id);

    // Si no existe el sílabo, retornar null para que el service maneje el error
    if (!datosGenerales) {
      return null;
    }

    // 2. Sumilla
    const sumillaResult = await this.db
      .select({ contenido: silaboSumilla.contenido })
      .from(silaboSumilla)
      .where(
        and(eq(silaboSumilla.silaboId, id), eq(silaboSumilla.esActual, true)),
      )
      .limit(1);

    // 3. Competencias del Curso
    const competencias = await this.db
      .select({
        id: silaboCompetenciaCurso.id,
        codigo: silaboCompetenciaCurso.codigo,
        descripcion: silaboCompetenciaCurso.descripcion,
        orden: silaboCompetenciaCurso.orden,
      })
      .from(silaboCompetenciaCurso)
      .where(eq(silaboCompetenciaCurso.silaboId, id))
      .orderBy(silaboCompetenciaCurso.orden);

    // 4. Componentes de Competencias (Conceptuales, Procedimentales, Actitudinales)
    const componentesConceptuales = await this.db
      .select()
      .from(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.silaboId, id),
          eq(silaboCompetenciaComponente.grupo, "COMP"),
        ),
      )
      .orderBy(silaboCompetenciaComponente.orden);

    const componentesProcedimentales = await this.db
      .select()
      .from(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.silaboId, id),
          eq(silaboCompetenciaComponente.grupo, "PROC"),
        ),
      )
      .orderBy(silaboCompetenciaComponente.orden);

    const componentesActitudinales = await this.db
      .select()
      .from(silaboCompetenciaComponente)
      .where(
        and(
          eq(silaboCompetenciaComponente.silaboId, id),
          eq(silaboCompetenciaComponente.grupo, "ACT"),
        ),
      )
      .orderBy(silaboCompetenciaComponente.orden);

    // 5. Resultados de Aprendizaje
    const resultadosAprendizaje = await this.db
      .select()
      .from(schema.silaboResultadoAprendizaje)
      .where(eq(schema.silaboResultadoAprendizaje.silaboId, id))
      .orderBy(schema.silaboResultadoAprendizaje.orden);

    // 6. Unidades Didácticas
    const unidades = await this.db
      .select()
      .from(schema.silaboUnidad)
      .where(eq(schema.silaboUnidad.silaboId, id))
      .orderBy(schema.silaboUnidad.numero);

    // 7. Estrategias Metodológicas (del silabo principal)
    const estrategiasResult = await this.db
      .select({ estrategias: silabo.estrategiasMetodologicas })
      .from(silabo)
      .where(eq(silabo.id, id));

    // 8. Recursos Didácticos
    const recursos = await this.db
      .select({
        id: schema.silaboRecursoDidactico.id,
        recursoId: schema.silaboRecursoDidactico.recursoId,
        recursoNombre: schema.recursoDidacticoCatalogo.nombre,
        destino: schema.silaboRecursoDidactico.destino,
        observaciones: schema.silaboRecursoDidactico.observaciones,
      })
      .from(schema.silaboRecursoDidactico)
      .innerJoin(
        schema.recursoDidacticoCatalogo,
        eq(
          schema.silaboRecursoDidactico.recursoId,
          schema.recursoDidacticoCatalogo.id,
        ),
      )
      .where(eq(schema.silaboRecursoDidactico.silaboId, id));

    // 9. Plan de Evaluación
    const planEvaluacion = await this.db
      .select()
      .from(schema.planEvaluacionOferta)
      .where(eq(schema.planEvaluacionOferta.silaboId, id))
      .orderBy(schema.planEvaluacionOferta.semana);

    // Formula de Evaluación
    const formulaEvaluacion = await this.db
      .select({
        expresion: schema.formulaEvaluacionRegla.expresionFinal,
      })
      .from(schema.formulaEvaluacionRegla)
      .where(
        and(
          eq(schema.formulaEvaluacionRegla.silaboId, id),
          eq(schema.formulaEvaluacionRegla.activo, true),
        ),
      )
      .limit(1);

    // 10. Fuentes de Información
    const fuentes = await this.db
      .select({
        id: schema.silaboFuente.id,
        tipo: schema.silaboFuente.tipo,
        autores: schema.silaboFuente.autores,
        anio: schema.silaboFuente.anio,
        titulo: schema.silaboFuente.titulo,
        editorial: schema.silaboFuente.editorialRevista,
        ciudad: schema.silaboFuente.ciudad,
        isbn: schema.silaboFuente.isbnIssn,
        url: schema.silaboFuente.doiUrl,
      })
      .from(schema.silaboFuente)
      .where(eq(schema.silaboFuente.silaboId, id));

    // 11. Aportes a Resultados del Programa
    const aportes = await this.db
      .select({
        resultadoCodigo:
          schema.silaboAporteResultadoPrograma.resultadoProgramaCodigo,
        resultadoDescripcion:
          schema.silaboAporteResultadoPrograma.resultadoProgramaDescripcion,
        aporteValor: schema.silaboAporteResultadoPrograma.aporteValor,
      })
      .from(schema.silaboAporteResultadoPrograma)
      .where(eq(schema.silaboAporteResultadoPrograma.silaboId, id));

    return {
      datosGenerales: {
        ...datosGenerales,
        areaCurricular: null, // Si no está en DB, null
      },
      sumilla: sumillaResult[0]?.contenido || null,
      competenciasCurso: competencias,
      componentesConceptuales,
      componentesProcedimentales,
      componentesActitudinales,
      resultadosAprendizaje,
      unidadesDidacticas: unidades,
      estrategiasMetodologicas: estrategiasResult[0]?.estrategias || null,
      recursosDidacticos: recursos,
      evaluacionAprendizaje: {
        planEvaluacion,
        formulaEvaluacion: formulaEvaluacion[0]?.expresion || null,
      },
      fuentes,
      aportesResultadosPrograma: aportes,
    };
  }

  // ---------- REVISIÓN ----------
  async findAllSyllabusInRevision(estado?: string, docenteId?: number) {
    let query = this.db
      .select({
        id: silabo.id,
        cursoNombre: silabo.cursoNombre,
        cursoCodigo: silabo.cursoCodigo,
        departamentoAcademico: silabo.departamentoAcademico,
        escuelaProfesional: silabo.escuelaProfesional,
        estadoRevision: silabo.estadoRevision,
        asignadoADocenteId: docente.id,
        nombreDocente: docente.nombreDocente,
        createdAt: silabo.createdAt,
        updatedAt: silabo.updatedAt,
      })
      .from(silabo)
      .innerJoin(silaboDocente, eq(silabo.id, silaboDocente.silaboId))
      .innerJoin(docente, eq(silaboDocente.docenteId, docente.id));

    // Aplicar filtros si existen
    const conditions = [];
    if (estado) {
      conditions.push(eq(silabo.estadoRevision, estado));
    }
    if (docenteId) {
      conditions.push(eq(silabo.asignadoADocenteId, docenteId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const result = await query.orderBy(silabo.updatedAt);
    return result.map((r) => ({
      cursoCodigo: r.cursoCodigo ?? null,
      cursoNombre: r.cursoNombre ?? null,
      estadoRevision: r.estadoRevision ?? null,
      syllabusId: r.id,
      docenteId: r.asignadoADocenteId ?? null,
      nombreDocente: r.nombreDocente ?? null,
    }));
  }

  async findSyllabusRevisionById(id: number) {
    const result = await this.db
      .select({
        id: silabo.id,
        cursoNombre: silabo.cursoNombre,
        cursoCodigo: silabo.cursoCodigo,
        departamentoAcademico: silabo.departamentoAcademico,
        escuelaProfesional: silabo.escuelaProfesional,
        estadoRevision: silabo.estadoRevision,
        asignadoADocenteId: silabo.asignadoADocenteId,
        nombreDocente: docente.nombreDocente,
        createdAt: silabo.createdAt,
        updatedAt: silabo.updatedAt,
      })
      .from(silabo)
      .leftJoin(docente, eq(silabo.asignadoADocenteId, docente.id))
      .where(eq(silabo.id, id))
      .limit(1);

    return result[0] || null;
  }
  async findSectionPermissions(silaboId: number, docenteId?: number) {
    const conditions = [eq(silaboSeccionPermiso.silaboId, silaboId)];
    if (docenteId !== undefined) {
      conditions.push(eq(silaboSeccionPermiso.docenteId, docenteId));
    }
    const result = await this.db
      .select({
        seccion: silaboSeccionPermiso.numeroSeccion,
      })
      .from(silaboSeccionPermiso)
      .where(and(...conditions));
    return result;
  }

  async updateSyllabusStatus(
    id: number,
    data: {
      estadoRevision: string;
      observaciones?: string | null;
      actualizadoPorDocenteId?: number | null;
    },
  ) {
    const updateData: any = {
      estadoRevision: data.estadoRevision,
      updatedAt: new Date().toISOString(),
    };

    if (data.observaciones !== undefined) {
      updateData.observaciones = data.observaciones;
    }

    if (data.actualizadoPorDocenteId !== undefined) {
      updateData.actualizadoPorDocenteId = data.actualizadoPorDocenteId;
    }

    const result = await this.db
      .update(silabo)
      .set(updateData)
      .where(eq(silabo.id, id))
      .returning();

    return result[0];
  }

  // ---------- REVISIÓN DE SECCIONES ----------
  async findRevisionSections(silaboId: number) {
    const result = await this.db
      .select({
        id: silaboRevisionSeccion.id,
        numeroSeccion: silaboRevisionSeccion.numeroSeccion,
        nombreSeccion: silaboRevisionSeccion.nombreSeccion,
        estado: silaboRevisionSeccion.estado,
        revisadoPor: silaboRevisionSeccion.revisadoPor,
        revisadoEn: silaboRevisionSeccion.revisadoEn,
        comentariosCount: silaboRevisionSeccion.comentariosCount,
        nombreDocente: docente.nombreDocente,
      })
      .from(silaboRevisionSeccion)
      .leftJoin(docente, eq(silaboRevisionSeccion.revisadoPor, docente.id))
      .where(eq(silaboRevisionSeccion.silaboId, silaboId))
      .orderBy(silaboRevisionSeccion.numeroSeccion);

    return result;
  }

  async upsertRevisionSections(
    silaboId: number,
    secciones: Array<{
      numeroSeccion: number;
      nombreSeccion: string;
      estado?: string;
    }>,
    docenteId?: number,
  ) {
    const results = [];

    for (const seccion of secciones) {
      // Verificar si ya existe
      const existing = await this.db
        .select()
        .from(silaboRevisionSeccion)
        .where(
          and(
            eq(silaboRevisionSeccion.silaboId, silaboId),
            eq(silaboRevisionSeccion.numeroSeccion, seccion.numeroSeccion),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        // Actualizar existente
        const updated = await this.db
          .update(silaboRevisionSeccion)
          .set({
            nombreSeccion: seccion.nombreSeccion,
            estado: seccion.estado || existing[0].estado,
            revisadoPor: docenteId || existing[0].revisadoPor,
            revisadoEn: new Date().toISOString(),
          })
          .where(eq(silaboRevisionSeccion.id, existing[0].id))
          .returning();

        results.push(updated[0]);
      } else {
        // Insertar nuevo
        const inserted = await this.db
          .insert(silaboRevisionSeccion)
          .values({
            silaboId,
            numeroSeccion: seccion.numeroSeccion,
            nombreSeccion: seccion.nombreSeccion,
            estado: seccion.estado || "PENDIENTE",
            revisadoPor: docenteId || null,
            revisadoEn: new Date().toISOString(),
            comentariosCount: 0,
          })
          .returning();

        results.push(inserted[0]);
      }
    }

    return results;
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
  async getFormulaEvaluacion(id: number) {
    const db = getDb();
    if (!db) return null;

    // Obtener la fórmula principal
    const [formula] = await db
      .select({
        id: schema.formulaEvaluacionRegla.id,
        name: schema.formulaEvaluacionRegla.nombreRegla,
        variableFinalCodigo: schema.formulaEvaluacionRegla.variableFinalCodigo,
        expresionFinal: schema.formulaEvaluacionRegla.expresionFinal,
      })
      .from(schema.formulaEvaluacionRegla)
      .where(eq(schema.formulaEvaluacionRegla.id, id));

    if (!formula) return null;

    // Obtener las subformulas
    const subformulas = await db
      .select({
        id: schema.formulaEvaluacionSubformula.id,
        variableCodigo: schema.formulaEvaluacionSubformula.variableCodigo,
        expresion: schema.formulaEvaluacionSubformula.expresion,
      })
      .from(schema.formulaEvaluacionSubformula)
      .where(
        eq(schema.formulaEvaluacionSubformula.formulaEvaluacionReglaId, id),
      );

    // Obtener todas las variables (leyendas)
    const variables = await db
      .select({
        id: schema.formulaEvaluacionVariable.id,
        formulaEvaluacionReglaId:
          schema.formulaEvaluacionVariable.formulaEvaluacionReglaId,
        codigo: schema.formulaEvaluacionVariable.codigo,
        nombre: schema.formulaEvaluacionVariable.nombre,
      })
      .from(schema.formulaEvaluacionVariable)
      .where(eq(schema.formulaEvaluacionVariable.formulaEvaluacionReglaId, id));

    // Mapa rápido para buscar por código
    const variableMap = new Map(variables.map((v) => [v.codigo, v.nombre]));

    // Crear lista de leyendas (solo a nivel principal)
    const legendPrincipal = variables.map((v) => ({
      key: v.codigo,
      description: v.nombre,
    }));

    // Estructura final de subfórmulas con name detectado automáticamente
    const subformulasSimplified = subformulas.map((sf) => {
      // Extraer la variable antes del "=" (ej: "PPR = (P1 + P2) / 2")
      const variableMatch = sf.expresion.split("=")[0].trim();
      const variableName = variableMap.get(variableMatch) || variableMatch;

      return {
        variable: variableMatch,
        name: variableName, // nombre obtenido automáticamente
        formula: sf.expresion.trim(),
      };
    });

    // Estructura final
    const result = {
      id: formula.id.toString(),
      name: formula.name,
      formula: formula.expresionFinal,
      legend: legendPrincipal,
      subformulas: subformulasSimplified,
    };

    return result;
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

  async getAllCourses() {
    try {
      const result = await this.db
        .select({
          id: silabo.id,
          code: silabo.cursoCodigo,
          name: silabo.cursoNombre,
          ciclo: silabo.ciclo,
          escuela: silabo.escuelaProfesional,
          estadoRevision: silabo.estadoRevision,
        })
        .from(silabo)
        .orderBy(asc(silabo.cursoCodigo));

      return result.map((r) => ({
        id: r.id,
        code: r.code ?? null,
        name: r.name ?? null,
        ciclo: r.ciclo ?? null,
        escuela: r.escuela ?? null,
        estadoRevision: r.estadoRevision ?? null,
      }));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Error al consultar cursos en la base de datos",
        error,
      );
    }
  }

  // ========================================
  // SECCIÓN I: DATOS GENERALES
  // ========================================
  async updateDatosGenerales(id: number, data: any) {
    const result = await this.db
      .update(silabo)
      .set(data)
      .where(eq(silabo.id, id))
      .returning();

    return result[0] || null;
  }

  // ========================================
  // SECCIÓN IV: UNIDADES
  // ========================================
  async findUnidadesBySilaboId(silaboId: number) {
    return await this.db
      .select()
      .from(schema.silaboUnidad)
      .where(eq(schema.silaboUnidad.silaboId, silaboId))
      .orderBy(schema.silaboUnidad.numero);
  }

  async insertUnidad(silaboId: number, data: any) {
    const result = await this.db
      .insert(schema.silaboUnidad)
      .values({
        silaboId,
        ...data,
      })
      .returning();

    return result[0];
  }

  async updateUnidad(silaboId: number, unidadId: number, data: any) {
    const result = await this.db
      .update(schema.silaboUnidad)
      .set(data)
      .where(
        and(
          eq(schema.silaboUnidad.id, unidadId),
          eq(schema.silaboUnidad.silaboId, silaboId),
        ),
      )
      .returning();

    return result[0] || null;
  }

  async deleteUnidad(silaboId: number, unidadId: number) {
    const result = await this.db
      .delete(schema.silaboUnidad)
      .where(
        and(
          eq(schema.silaboUnidad.id, unidadId),
          eq(schema.silaboUnidad.silaboId, silaboId),
        ),
      )
      .returning();

    return result.length > 0;
  }

  // ========================================
  // SECCIÓN VIII: FUENTES
  // ========================================
  async findFuentesBySilaboId(silaboId: number) {
    return await this.db
      .select()
      .from(schema.silaboFuente)
      .where(eq(schema.silaboFuente.silaboId, silaboId));
  }

  async insertFuente(silaboId: number, data: any) {
    const result = await this.db
      .insert(schema.silaboFuente)
      .values({
        silaboId,
        tipo: data.tipo,
        autores: data.autores || null,
        anio: data.anio || null,
        titulo: data.titulo,
        editorialRevista: data.editorialRevista || null,
        ciudad: data.ciudad || null,
        isbnIssn: data.isbnIssn || null,
        doiUrl: data.doiUrl || null,
        notas: data.notas || null,
      })
      .returning();

    return result[0];
  }

  async updateFuente(silaboId: number, fuenteId: number, data: any) {
    const result = await this.db
      .update(schema.silaboFuente)
      .set(data)
      .where(
        and(
          eq(schema.silaboFuente.id, fuenteId),
          eq(schema.silaboFuente.silaboId, silaboId),
        ),
      )
      .returning();

    return result[0] || null;
  }

  async deleteFuente(silaboId: number, fuenteId: number) {
    const result = await this.db
      .delete(schema.silaboFuente)
      .where(
        and(
          eq(schema.silaboFuente.id, fuenteId),
          eq(schema.silaboFuente.silaboId, silaboId),
        ),
      )
      .returning();

    return result.length > 0;
  }

  // ========================================
  // SECCIÓN IX: APORTES
  // ========================================
  async findContributionsBySilaboId(silaboId: number) {
    return await this.db
      .select()
      .from(schema.silaboAporteResultadoPrograma)
      .where(eq(schema.silaboAporteResultadoPrograma.silaboId, silaboId));
  }

  async updateContribution(
    silaboId: number,
    contributionId: number,
    data: any,
  ) {
    // Nota: silaboAporteResultadoPrograma usa composite primary key
    const result = await this.db
      .update(schema.silaboAporteResultadoPrograma)
      .set(data)
      .where(eq(schema.silaboAporteResultadoPrograma.silaboId, silaboId))
      .returning();

    return result[0] || null;
  }

  // ========================================
  // REVISIÓN
  // ========================================
  async findAllRevisions() {
    return await this.db
      .select()
      .from(schema.silaboRevisionHistorial)
      .orderBy(sql`${schema.silaboRevisionHistorial.creadoEn} DESC`);
  }

  async findRevisionBySilaboId(silaboId: number) {
    return await this.db
      .select()
      .from(schema.silaboRevisionHistorial)
      .where(eq(schema.silaboRevisionHistorial.silaboId, silaboId))
      .orderBy(sql`${schema.silaboRevisionHistorial.creadoEn} DESC`);
  }

  async insertRevision(silaboId: number, data: any) {
    const result = await this.db
      .insert(schema.silaboRevisionHistorial)
      .values({
        silaboId,
        ...data,
      })
      .returning();

    return result[0];
  }

  async aprobarSilabo(silaboId: number) {
    const result = await this.db
      .update(silabo)
      .set({
        estadoRevision: "APROBADO",
      })
      .where(eq(silabo.id, silaboId))
      .returning();

    return result[0] || null;
  }

  async desaprobarSilabo(silaboId: number, data: any) {
    const result = await this.db
      .update(silabo)
      .set({
        estadoRevision: "DESAPROBADO",
        observaciones: data.observaciones || null,
      })
      .where(eq(silabo.id, silaboId))
      .returning();

    return result[0] || null;
  }
}

export const syllabusRepository = new SyllabusRepository();
