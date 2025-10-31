import { getDb } from "../../db";
import { eq, and } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";
import { AppError } from "../../error";
import type { CreateSumilla } from "./types";

const { silaboSumilla } = schema;

export class SumillaRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    const database = getDb();
    if (!database) {
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "No se pudo obtener la conexión a la base de datos",
      );
    }
    this.db = database as unknown as NodePgDatabase<typeof schema>;
  }

  async create(data: CreateSumilla) {
    try {
      await this.db
        .update(silaboSumilla)
        .set({ esActual: false })
        .where(eq(silaboSumilla.silaboId, data.silaboId));

      const [inserted] = await this.db
        .insert(silaboSumilla)
        .values({
          silaboId: data.silaboId,
          contenido: data.contenido,
          palabrasClave: data.palabrasClave || null,
          esActual: true,
        })
        .returning();

      return inserted;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "DatabaseError",
        "INTERNAL_SERVER_ERROR",
        "Error al consultar sílabos en la base de datos",
        error,
      );
    }
  }
}

export const sumillaRepository = new SumillaRepository();
