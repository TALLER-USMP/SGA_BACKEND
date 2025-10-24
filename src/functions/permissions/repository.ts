import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import { silaboDocente, docente, silabo } from "../../../drizzle/schema";
//1
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

export class PermissionsRepository {
  async findAllSyllabusDocente() {
    const db = getDbOrThrow();
    const rows = await db
      .select({
        id: silaboDocente.id,
        silaboId: silaboDocente.silaboId,
        docenteId: silaboDocente.docenteId,
        nombreDocente: docente.nombreDocente,
        cursoNombre: silabo.cursoNombre,
      })
      .from(silaboDocente)
      .leftJoin(docente, eq(silaboDocente.docenteId, docente.id))
      .leftJoin(silabo, eq(silaboDocente.silaboId, silabo.id));
    return rows;
  }

  async findSyllaboDocenteById(silaboDocenteId: number) {
    const db = getDbOrThrow();
    const result = await db
      .select({
        id: silaboDocente.id,
        silaboId: silaboDocente.silaboId,
        docenteId: silaboDocente.docenteId,
        nombreDocente: docente.nombreDocente,
        cursoNombre: silabo.cursoNombre,
      })
      .from(silaboDocente)
      .leftJoin(docente, eq(silaboDocente.docenteId, docente.id))
      .leftJoin(silabo, eq(silaboDocente.silaboId, silabo.id))
      .where(eq(silaboDocente.id, silaboDocenteId));

    return result;
  }

  async findAllPermissions() {
    // const db = getDbOrThrow();
    const permissions = [
      {
        id: 1,
        section: "datos_generales",
        name: "1. Datos generales",
        value: false,
      },
      {
        id: 2,
        section: "sumilla",
        name: "2. Sumilla",
        value: false,
      },
      {
        id: 3,
        section: "competencias",
        name: "3. Competencias y componentes",
        value: false,
      },
      {
        id: 4,
        section: "programacion",
        name: "4. Programación del contenido",
        value: false,
      },
      {
        id: 5,
        section: "estrategias",
        name: "5. Estrategias metodológicas",
        value: false,
      },
      {
        id: 6,
        section: "recursos",
        name: "6. Recursos didácticos",
        value: false,
      },
      {
        id: 7,
        section: "evaluacion",
        name: "7. Evaluación de aprendizaje",
        value: false,
      },
      {
        id: 8,
        section: "fuentes",
        name: "8. Fuentes de consulta",
        value: false,
      },
      {
        id: 9,
        section: "resultados",
        name: "9. Resultados (outcomes)",
        value: false,
      },
    ];

    return permissions;
  }
  async findDocenteById(docenteId: number) {
    const db = getDbOrThrow();
    const result = await db
      .select()
      .from(docente)
      .where(eq(docente.id, docenteId));
    return result;
  }
}

export const permissionsRepository = new PermissionsRepository();
