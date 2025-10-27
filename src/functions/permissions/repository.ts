import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import { silaboDocente, docente, silabo } from "../../../drizzle/schema";
import { z } from "zod";
import { PermissionsSchema } from "./types";

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
      },
      {
        id: 2,
        section: "sumilla",
        name: "2. Sumilla",
      },
      {
        id: 3,
        section: "competencias",
        name: "3. Competencias y componentes",
      },
      {
        id: 4,
        section: "programacion",
        name: "4. Programación del contenido",
      },
      {
        id: 5,
        section: "estrategias",
        name: "5. Estrategias metodológicas",
      },
      {
        id: 6,
        section: "recursos",
        name: "6. Recursos didácticos",
      },
      {
        id: 7,
        section: "evaluacion",
        name: "7. Evaluación de aprendizaje",
      },
      {
        id: 8,
        section: "fuentes",
        name: "8. Fuentes de consulta",
      },
      {
        id: 9,
        section: "resultados",
        name: "9. Resultados (outcomes)",
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

  async savePermissions(data: z.infer<typeof PermissionsSchema>) {
    const result = data;
    /*
    LOGICA DE INSERCION DE PERMISOS
    const db = getDbOrThrow();
    db.insert(permissions).values({
      silaboId: data.silaboId,
      docenteId: data.docenteId,
      .....
  });
    */
  }
}

export const permissionsRepository = new PermissionsRepository();
