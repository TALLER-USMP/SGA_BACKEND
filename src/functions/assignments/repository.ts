import { getDb } from "../../db";
import { silabo, silaboDocente } from "../../../drizzle/schema";
import { ilike, eq, and, asc } from "drizzle-orm";
import type { SilaboListItem, SilaboFilters } from "./types";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";

const db = getDb() as unknown as NodePgDatabase<typeof schema>;

export const SilaboRepository = {
  async getAll(filters?: SilaboFilters): Promise<SilaboListItem[]> {
    const conditions: any[] = [];

    if (filters?.codigo?.trim()) {
      conditions.push(ilike(silabo.cursoCodigo, `%${filters.codigo.trim()}%`));
    }

    if (filters?.nombre?.trim()) {
      conditions.push(ilike(silabo.cursoNombre, `%${filters.nombre.trim()}%`));
    }

    if (filters?.idDocente) {
      conditions.push(eq(silaboDocente.docenteId, filters.idDocente));
    }

    const query = db
      .select({
        cursoCodigo: silabo.cursoCodigo,
        cursoNombre: silabo.cursoNombre,
        estadoRevision: silabo.estadoRevision,
        docenteId: silaboDocente.docenteId,
      })
      .from(silabo)
      .innerJoin(silaboDocente, eq(silabo.id, silaboDocente.silaboId));

    if (conditions.length === 1) {
      query.where(conditions[0]);
    } else if (conditions.length > 1) {
      query.where(and(...conditions));
    }

    query.orderBy(asc(silabo.cursoCodigo));

    const result = await query;

    return result.map((r) => ({
      cursoCodigo: r.cursoCodigo ?? null,
      cursoNombre: r.cursoNombre ?? null,
      estadoRevision: r.estadoRevision ?? null,
      docenteId: r.docenteId ?? null,
    }));
  },
};
