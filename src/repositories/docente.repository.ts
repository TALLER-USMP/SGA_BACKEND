import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { silabo } from "../../drizzle/schema";

export type AsignaturaRow = {
  idSilabo: number;
  cursoCodigo: string | null;
  cursoNombre: string | null;
  ciclo: string | null;
  semestreAcademico: string | null;
  docentesText: string | null;
};

export class DocenteRepository {
  private db = getDb();

  // Lista todas las asignaturas
  async findAsignaturas(): Promise<AsignaturaRow[]> {
    if (!this.db) throw new Error("Database connection is not initialized.");

    const rows = await this.db
      .select({
        idSilabo: silabo.id,
        cursoCodigo: silabo.cursoCodigo,
        cursoNombre: silabo.cursoNombre,
        ciclo: silabo.ciclo,
        semestreAcademico: silabo.semestreAcademico,
        docentesText: silabo.docentesText,
      })
      .from(silabo);

    return rows;
  }

  // Lista de asignaturas por docente
  async findAsignaturasByDocenteId(
    docenteId: number,
  ): Promise<AsignaturaRow[]> {
    if (!this.db) throw new Error("Database connection is not initialized.");

    const rows = await this.db
      .select({
        idSilabo: silabo.id,
        cursoCodigo: silabo.cursoCodigo,
        cursoNombre: silabo.cursoNombre,
        ciclo: silabo.ciclo,
        semestreAcademico: silabo.semestreAcademico,
        docentesText: silabo.docentesText,
      })
      .from(silabo)
      .where(eq(silabo.asignadoAUsuarioAutorizadoId, docenteId));

    return rows;
  }
}
