import { getDb } from "../../db/index";
import { silabo } from "../../../drizzle/schema";
import { SyllabusCreateSchema } from "./types";
import { z } from "zod";
import { eq } from "drizzle-orm";

class SyllabusRepository {
  private db = getDb();

  async create(syllabusData: z.infer<typeof SyllabusCreateSchema>) {
    if (!this.db) throw new Error("Database not connected");
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
    if (!this.db) throw new Error("Database not connected");
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
