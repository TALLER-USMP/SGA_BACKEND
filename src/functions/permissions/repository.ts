import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import {
  silaboDocente,
  docente,
  silabo,
  silaboSeccionPermiso,
} from "../../../drizzle/schema";
import { z } from "zod";
import { PermissionsSchema } from "./types";

type Upsertable = { id?: number | string; text: string; order?: number | null };
type CreateItem = { text: string; order?: number | null; code?: string | null };

const GROUP_COMP = "COMP";
const GROUP_ACT = "ACT";

export class PermissionsRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    const database = getDb();
    if (!database) {
      throw new AppError(
        "DbConnectionError",
        "INTERNAL_SERVER_ERROR",
        "DB no inicializada",
      );
    }
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }
  // async findAllPermissions() {
  //   // const db = getDbOrThrow();
  //   const permissions = [
  //     {
  //       id: 1,
  //       section: "datos_generales",
  //       name: "1. Datos generales",
  //     },
  //     {
  //       id: 2,
  //       section: "sumilla",
  //       name: "2. Sumilla",
  //     },
  //     {
  //       id: 3,
  //       section: "competencias",
  //       name: "3. Competencias y componentes",
  //     },
  //     {
  //       id: 4,
  //       section: "programacion",
  //       name: "4. Programación del contenido",
  //     },
  //     {
  //       id: 5,
  //       section: "estrategias",
  //       name: "5. Estrategias metodológicas",
  //     },
  //     {
  //       id: 6,
  //       section: "recursos",
  //       name: "6. Recursos didácticos",
  //     },
  //     {
  //       id: 7,
  //       section: "evaluacion",
  //       name: "7. Evaluación de aprendizaje",
  //     },
  //     {
  //       id: 8,
  //       section: "fuentes",
  //       name: "8. Fuentes de consulta",
  //     },
  //     {
  //       id: 9,
  //       section: "resultados",
  //       name: "9. Resultados (outcomes)",
  //     },
  //   ];

  //   return permissions;
  // }
  async findDocenteById(docenteId: number) {
    const result = await this.db
      .select()
      .from(docente)
      .where(eq(docente.id, docenteId));
    return result;
  }

  async savePermissionsBySilaboIdAndDocenteId(
    silaboId: number,
    docenteId: number,
    permisos: any[],
  ) {
    // Eliminar permisos previos del mismo docente/sílabo
    await this.db
      .delete(silaboSeccionPermiso)
      .where(
        and(
          eq(silaboSeccionPermiso.silaboId, silaboId),
          eq(silaboSeccionPermiso.docenteId, docenteId),
        ),
      );

    // Fecha actual + 20 días
    const fechaActual = new Date();
    const fechaLimite = new Date(fechaActual);
    fechaLimite.setDate(fechaActual.getDate() + 20);

    // Insertar nuevos permisos
    const insertados = await this.db
      .insert(silaboSeccionPermiso)
      .values(
        permisos.map((p) => ({
          silaboId: Number(silaboId),
          docenteId: Number(docenteId),
          numeroSeccion: Number(p.numeroSeccion),
          puedeEditar: true,
          puedeComentar: false,
          fechaLimite: fechaLimite.toISOString(),
          bloqueadoPorEstado: false, // por defecto false al registrar
        })),
      )
      .returning();

    return insertados;
  }
  async findPermissionsByDocenteId(docenteId: number) {
    const result = await this.db
      .select({ numeroSeccion: silaboSeccionPermiso.numeroSeccion })
      .from(silaboSeccionPermiso)
      .where(eq(silaboSeccionPermiso.docenteId, docenteId));
    return result;
  }
}

export const permissionsRepository = new PermissionsRepository();
