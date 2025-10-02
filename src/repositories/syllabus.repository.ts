import { and, eq, ilike } from "drizzle-orm";
import { getDb } from "../db/index";
import { silabo } from "../../drizzle/schema";

export class SyllabusRepository {
  private db = getDb();

  async findByNameCycleStatus(filtros: {
    nombre?: string;
    ciclo?: string;
    estado?: string;
  }) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    let condiciones: any[] = [];

    if (filtros.nombre) {
      condiciones.push(ilike(silabo.cursoNombre, `%${filtros.nombre}%`));
    }
    if (filtros.ciclo) {
      condiciones.push(eq(silabo.ciclo, filtros.ciclo));
    }
    // if (filtros.estado) {
    //    condiciones.push(eq(silabo.estado, filtros.estado)); //cuando exista en DB
    // }

    const query = condiciones.length > 0 ? and(...condiciones) : undefined;
    const result = await this.db
      .select({
        silabo,
        //   estado: silabo.estado, // <- placeholder hasta que tengas el campo
      })
      .from(silabo)
      .where(query || undefined);

    return result.length ? result : [];
  }
}
