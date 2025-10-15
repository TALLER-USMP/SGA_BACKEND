import { getDb } from "../../db/index";
import { silabo } from "../../../drizzle/schema";
import { docente } from "../../../drizzle/schema";
import { silaboDocente } from "../../../drizzle/schema";
import { SyllabusCreateSchema } from "./types";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { AppError } from "../../error";

class SyllabusRepository {
  private db = getDb();

  async findGeneralDataById(id: number) {
    if (!this.db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
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
        horasTotales: silabo.horasTotales,
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
        creditosTotales: silabo.creditosTotales,
      })
      .from(silabo)
      .where(eq(silabo.id, id));

    // const docentes = await this.db
    //   .select({ nombreDocente: docente.nombreDocente })
    //   .from(silaboDocente)
    //   .leftJoin(docente, eq(silaboDocente.docenteId, docente.id))
    //   .where(eq(silaboDocente.silaboId, id));

    return silaboResult[0];
    //docentes: docentes.map((d) => d.nombreDocente).join(", "),
  }

  async create(syllabusData: z.infer<typeof SyllabusCreateSchema>) {
    if (!this.db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
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
        horasTotales: syllabusData.horasTotales ?? null,

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
        creditosTotales: syllabusData.creditosTotales ?? null,

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
    if (!this.db)
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Database not connected",
      );
    await this.db
      .update(silabo)
      .set({
        sumilla,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(silabo.id, id));
  }
}

export const syllabusRepository = new SyllabusRepository();
