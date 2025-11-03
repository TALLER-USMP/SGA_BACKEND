import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import { silabo } from "../../../drizzle/schema";
import { z } from "zod";

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

export class RevisionRepository {
  async findAllCourseAndStateBySilaboId() {
    const db = getDbOrThrow();
    const silaboRecord = await db
      .select({
        id: silabo.id,
        curosNombre: silabo.cursoNombre,
        estado: silabo.estadoRevision,
      })
      .from(silabo);
    return silaboRecord;
  }
}

export const revisionRepository = new RevisionRepository();
