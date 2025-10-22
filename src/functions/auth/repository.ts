import { getDb } from "../../db";
import { categoriaUsuario, docente } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { MicrosoftJwtPayload, Professor, UserCategory } from "./types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";

class AuthRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    this.db = getDb() as unknown as NodePgDatabase<typeof schema>;
  }

  async findUserByEmail(
    email: string,
  ): Promise<{ user: Professor; category: UserCategory } | null> {
    const result = await this.db
      .select({
        user: docente,
        category: categoriaUsuario,
      })
      .from(docente)
      .leftJoin(
        categoriaUsuario,
        eq(docente.categoriaUsuarioId, categoriaUsuario.id),
      )
      .where(eq(docente.correo, email))
      .limit(1);

    if (result.length === 0 || !result[0].category) {
      return null;
    }

    return {
      user: result[0].user,
      category: result[0].category,
    };
  }

  async createUser(
    payload: MicrosoftJwtPayload,
  ): Promise<{ user: Professor; category: UserCategory }> {
    const defaultCategory = await this.db
      .select()
      .from(categoriaUsuario)
      .where(eq(categoriaUsuario.nombreCategoria, "indeterminado"))
      .limit(1);

    const defaultCategoryId = defaultCategory[0].id;

    const newUser = await this.db
      .insert(docente)
      .values({
        correo: payload.preferred_username,
        categoriaUsuarioId: defaultCategoryId,
        azureAdObjectId: payload.oid,
        tenantId: payload.tid,
        ultimoAccesoEn: new Date().toISOString(),
      })
      .returning();

    return {
      user: newUser[0],
      category: defaultCategory[0],
    };
  }
  async updateLastAccess(
    userId: number,
    payload: MicrosoftJwtPayload,
  ): Promise<Professor> {
    const updatedUser = await this.db
      .update(docente)
      .set({
        ultimoAccesoEn: new Date().toISOString(),
        azureAdObjectId: payload.oid || undefined,
        tenantId: payload.tid || undefined,
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(docente.id, userId))
      .returning();

    return updatedUser[0];
  }

  async updateOnlyLastAccess(userId: number): Promise<void> {
    await this.db
      .update(docente)
      .set({
        ultimoAccesoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(docente.id, userId));
  }
}

export const authRepository = new AuthRepository();
