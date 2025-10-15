import { getDb } from "../../db";
import { authorizedUser, userCategory } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { MicrosoftJwtPayload, AuthorizedUser, UserCategory } from "./types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema";

class AuthRepository {
  private db: NodePgDatabase<typeof schema>;

  constructor() {
    this.db = getDb() as unknown as NodePgDatabase<typeof schema>;
  }

  async findUserByEmail(
    correo: string,
  ): Promise<{ user: AuthorizedUser; category: UserCategory } | null> {
    const result = await this.db
      .select({
        user: authorizedUser,
        category: userCategory,
      })
      .from(authorizedUser)
      .leftJoin(
        userCategory,
        eq(authorizedUser.categoriaUsuarioId, userCategory.id),
      )
      .where(eq(authorizedUser.correo, correo.toLowerCase()))
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
  ): Promise<{ user: AuthorizedUser; category: UserCategory }> {
    const defaultCategory = await this.db
      .select()
      .from(userCategory)
      .where(eq(userCategory.nombreCategoria, "indeterminado"))
      .limit(1);

    const defaultCategoryId = defaultCategory[0].id;

    const newUser = await this.db
      .insert(authorizedUser)
      .values({
        correo: payload.email.toLowerCase(),
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
  ): Promise<AuthorizedUser> {
    const updatedUser = await this.db
      .update(authorizedUser)
      .set({
        ultimoAccesoEn: new Date().toISOString(),
        azureAdObjectId: payload.oid || undefined,
        tenantId: payload.tid || undefined,
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(authorizedUser.id, userId))
      .returning();

    return updatedUser[0];
  }

  async updateOnlyLastAccess(userId: number): Promise<void> {
    await this.db
      .update(authorizedUser)
      .set({
        ultimoAccesoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(authorizedUser.id, userId));
  }
}

export const authRepository = new AuthRepository();
