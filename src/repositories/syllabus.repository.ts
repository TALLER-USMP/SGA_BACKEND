import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";
import { silaboResultadoAprendizajeCurso } from "../../drizzle/schema";
import { silaboUnidad } from "../../drizzle/schema";
import { silaboUnidadSemana } from "../../drizzle/schema";
import { silaboUnidadContenido } from "../../drizzle/schema";
import { silaboEvaluacion } from "../../drizzle/schema";
import { silaboFuente } from "../../drizzle/schema";
import { silaboAporteResultadoPrograma } from "../../drizzle/schema";

export class SyllabusRepository {
  private db = getDb();

  async findById(id: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const numericIdSilabo = Number(id);

    // 1. Silabo Base
    const silaboBase = await this.db
      .select()
      .from(silabo)
      .where(eq(silabo.id, numericIdSilabo));

    // 2. Resultados de aprendizaje
    const resultados = await this.db
      .select()
      .from(silaboResultadoAprendizajeCurso)
      .where(eq(silaboResultadoAprendizajeCurso.silaboId, numericIdSilabo));

    // 3. Unidades
    const unidades = await this.db
      .select()
      .from(silaboUnidad)
      .where(eq(silaboUnidad.silaboId, numericIdSilabo));

    // 4. Para cada unidad → semanas
    const unidadesConSemanas = await Promise.all(
      unidades.map(async (u) => {
        const semanas = await this.db!.select()
          .from(silaboUnidadSemana)
          .where(eq(silaboUnidadSemana.silaboUnidadId, u.id));
        return { ...u, semanas };
      }),
    );

    // 4b. Para cada unidad → contenidos
    const unidadesConContenidos = await Promise.all(
      unidadesConSemanas.map(async (u) => {
        const contenidos = await this.db!.select()
          .from(silaboUnidadContenido)
          .where(eq(silaboUnidadContenido.silaboUnidadId, u.id));
        return { ...u, contenidos };
      }),
    );

    // 5. Evaluaciones
    const evaluaciones = await this.db
      .select()
      .from(silaboEvaluacion)
      .where(eq(silaboEvaluacion.silaboId, numericIdSilabo));

    // 6. Fuentes
    const fuentes = await this.db
      .select({
        tipo: silaboFuente.tipo,
        autores: silaboFuente.autores,
        //anio: silaboFuente.anio,
        titulo: silaboFuente.titulo,
        editorialRevista: silaboFuente.editorialRevista,
        ciudad: silaboFuente.ciudad,
        isbnIssn: silaboFuente.isbnIssn,
        doiUrl: silaboFuente.doiUrl,
        notas: silaboFuente.notas,
      })
      .from(silaboFuente)
      .where(eq(silaboFuente.silaboId, numericIdSilabo));

    // 7. Aportes resultado programa
    const aportes = await this.db
      .select()
      .from(silaboAporteResultadoPrograma)
      .where(eq(silaboAporteResultadoPrograma.silaboId, numericIdSilabo));

    return silaboBase.length
      ? {
          ...silaboBase[0],
          resultados,
          unidades: unidadesConContenidos,
          evaluaciones,
          fuentes,
          aportes,
        }
      : null;
  }

  async updateCompetencies(silaboId: number, data: any[]) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    // Primero eliminamos las competencias actuales del sílabo
    /*await this.db
      .delete(silaboCompetencia)
      .where(eq(silaboCompetencia.silaboId, silaboId));*/

    // Luego insertamos las nuevas competencias y componentes
    // for (const comp of data) {
    //   const [insertedCompetencia] = await this.db
    //     .insert(silaboCompetencia)
    //     .values({
    //       silaboId,
    //       competencia: comp.competencia,
    //     })
    //     .returning({ id: silaboCompetencia.id });

    //   if (comp.componentes && comp.componentes.length > 0) {
    //     await this.db.insert(silaboComponente).values(
    //       comp.componentes.map((c: string) => ({
    //         competenciaId: insertedCompetencia.id,
    //         componente: c,
    //       }))
    //     );
    //   }
    // }

    return { message: "Competencias actualizadas correctamente" };
  }
}
