import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import {
  silaboCompetenciaCurso,
  silaboCompetenciaComponente,
} from "../../../drizzle/schema";
import { AppError } from "../../error";

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
}

export const syllabusRepository = new SyllabusRepository();
