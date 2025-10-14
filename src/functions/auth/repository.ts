import { getDb } from "../../db";
import { authorizedUser, userCategory } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { MicrosoftJwtPayload, AuthorizedUser, UserCategory } from "./types";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../../drizzle/schema"; // Necesario para la tipificación forzada

// OBTENER LA INSTANCIA DE DB
// ⚠️ Doble aserción de tipo para silenciar el error ts(2352)
// Esto le dice a TypeScript: "Convierte a 'unknown' y luego fuerzalo al tipo correcto."
const db = getDb()! as unknown as NodePgDatabase<typeof schema>;

if (!db) {
  // Esto asegura que si getDb() regresa null (por un error de conexión), el proceso se detenga.
  throw new Error(
    "ERROR FATAL: No se pudo obtener la instancia de la base de datos.",
  );
}

/**
 * Busca un usuario autorizado y su categoría por correo electrónico.
 * @param correo Correo electrónico del usuario.
 * @returns {Promise<{user: AuthorizedUser, category: UserCategory} | null>}
 */
export async function findUserByEmail(
  correo: string,
): Promise<{ user: AuthorizedUser; category: UserCategory } | null> {
  const result = await db
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

export async function createUser(
  payload: MicrosoftJwtPayload,
): Promise<{ user: AuthorizedUser; category: UserCategory }> {
  const defaultCategory = await db
    .select()
    .from(userCategory)
    .where(eq(userCategory.nombreCategoria, "indeterminado"))
    .limit(1);

  if (defaultCategory.length === 0) {
    throw new Error(
      "La categoría 'indeterminado' no existe en la base de datos.",
    );
  }
  const defaultCategoryId = defaultCategory[0].id;

  const newUser = await db
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

/**
 * Actualiza la información de acceso de un usuario existente.
 * @param userId ID del usuario a actualizar.
 * @param payload Payload del JWT de Microsoft (para actualizar OID/TID).
 * @returns {Promise<AuthorizedUser>} El usuario actualizado.
 */
export async function updateLastAccess(
  userId: number,
  payload: MicrosoftJwtPayload,
): Promise<AuthorizedUser> {
  const updatedUser = await db
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

/**
 * Actualiza solo el último acceso de un usuario (usado en /auth/me/).
 */
export async function updateOnlyLastAccess(userId: number): Promise<void> {
  await db
    .update(authorizedUser)
    .set({
      ultimoAccesoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    })
    .where(eq(authorizedUser.id, userId));
}
