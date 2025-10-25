import { getDb } from "../../db";
import { silabo } from "../../../drizzle/schema";
import { ilike, asc, and } from "drizzle-orm";
import type { SilaboListItem, SilaboFilters } from "./types";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";

const db = getDb() as unknown as NodePgDatabase<typeof schema>;

export const SilaboRepository = {
  /**
   * Retorna la lista de sílabos con filtros opcionales.
   */
  async getAll(filters?: SilaboFilters): Promise<SilaboListItem[]> {
    const conditions = [];

    if (filters?.codigo?.trim()) {
      conditions.push(ilike(silabo.cursoCodigo, `%${filters.codigo.trim()}%`));
    }

    if (filters?.nombre?.trim()) {
      conditions.push(ilike(silabo.cursoNombre, `%${filters.nombre.trim()}%`));
    }

    const query = db
      .select({
        cursoCodigo: silabo.cursoCodigo,
        cursoNombre: silabo.cursoNombre,
        estadoRevision: silabo.estadoRevision,
      })
      .from(silabo);

    if (conditions.length === 1) {
      query.where(conditions[0]);
    } else if (conditions.length > 1) {
      query.where(and(...conditions));
    }

    // ✅ Ordenar correctamente por cursoCodigo
    query.orderBy(asc(silabo.cursoCodigo));

    const result = await query;

    return result.map((r) => ({
      cursoCodigo: r.cursoCodigo ?? null,
      cursoNombre: r.cursoNombre ?? null,
      estadoRevision: r.estadoRevision ?? null,
    }));
  },
};
