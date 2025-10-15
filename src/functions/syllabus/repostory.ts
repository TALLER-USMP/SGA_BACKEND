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

    const docentes = await this.db
      .select({
        nombreDocente: docente.nombreDocente,
      })
      .from(silaboDocente)
      .innerJoin(docente, eq(silaboDocente.docenteId, docente.id))
      .where(eq(silaboDocente.silaboId, id));

    //return silaboResult[0];
    //docentes: docentes.map((d) => d.nombreDocente).join(", "),
    return {
      ...silaboResult[0],
      docentes: docentes.map((d) => d.nombreDocente).join(", "),
    };
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
