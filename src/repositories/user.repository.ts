import { eq, and } from "drizzle-orm";
import { getDb } from "../db/index";
import { categoriaUsuario, usuarioAutorizado } from "../../drizzle/schema";

export class UserRepository {
  private db = getDb();

  async findByEmail(email: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .select()
      .from(usuarioAutorizado)
      .where(eq(usuarioAutorizado.correo, email));
    return result.length ? result[0] : null;
  }

  async findById(id: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .select()
      .from(usuarioAutorizado)
      .where(eq(usuarioAutorizado.id, Number(id)));

    return result.length ? result[0] : null;
  }

  async findByOidAndTenant(oid: string, tenantId: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const result = await this.db
      .select()
      .from(usuarioAutorizado)
      .where(
        and(
          eq(usuarioAutorizado.azureAdObjectId, oid),
          eq(usuarioAutorizado.tenantId, tenantId),
        ),
      );

    if (result.length === 0) {
      console.log("find oid or tenant id, don't exist");
      return null;
    }

    if (result.length > 1) {
      console.warn(
        `⚠️ Multiple users found for OID ${oid} and Tenant ${tenantId}`,
      );
    }
    return result[0];
  }

  async updateOidAndTenant(id: number, oid: string, tenantId: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .update(usuarioAutorizado)
      .set({
        azureAdObjectId: oid,
        tenantId: tenantId,
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(usuarioAutorizado.id, id))
      .returning();

    return result.length ? result[0] : null;
  }

  async updateLastAccess(id: number) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .update(usuarioAutorizado)
      .set({
        ultimoAccesoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
      })
      .where(eq(usuarioAutorizado.id, id))
      .returning();

    return result.length ? result[0] : null;
  }

  async findWithCategory(oid: string, tenantId: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const result = await this.db
      .select({
        id: usuarioAutorizado.id,
        correo: usuarioAutorizado.correo,
        activo: usuarioAutorizado.activo,
        azureOid: usuarioAutorizado.azureAdObjectId,
        tenantId: usuarioAutorizado.tenantId,
        categoria: {
          id: categoriaUsuario.id,
          nombre_categoria: categoriaUsuario.nombreCategoria,
          descripcion: categoriaUsuario.descripcion,
          activo: categoriaUsuario.activo,
        },
      })
      .from(usuarioAutorizado)
      .leftJoin(
        categoriaUsuario,
        eq(usuarioAutorizado.categoriaUsuarioId, categoriaUsuario.id),
      )
      .where(
        and(
          eq(usuarioAutorizado.azureAdObjectId, oid),
          eq(usuarioAutorizado.tenantId, tenantId),
        ),
      );

    if (result.length === 0) {
      console.log("Usuario no encontrado con oid/tenant");
      return null;
    }

    return result[0];
  }

  async create({
    correo,
    categoriaUsuarioId,
    azureOid,
    tenantId,
    activo = true,
  }: {
    correo: string;
    categoriaUsuarioId: number;
    azureOid: string;
    tenantId: string;
    activo?: boolean;
  }) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }

    const now = new Date().toISOString();

    const result = await this.db
      .insert(usuarioAutorizado)
      .values({
        correo,
        azureAdObjectId: azureOid,
        tenantId,
        activo,
        categoriaUsuarioId: categoriaUsuarioId,
        creadoEn: now,
        actualizadoEn: now,
      })
      .returning();

    return result.length ? result[0] : null;
  }
}
