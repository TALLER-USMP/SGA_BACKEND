import { verifyTokenWithMsal } from "../utils/verifyTokenAzureMsal.utils";
import { AzurePayloadSchema } from "../types/auth.types";
import { ROLES } from "../constants";
import { AppError } from "../error";
import { userRepo } from "../repositories/user.repository";
import jwt from "jsonwebtoken";

class AuthService {
  createSessionToken(user: any) {
    return jwt.sign(
      {
        id: user.id,
        oid: user.azureOid,
        tenantId: user.tenantId,
        email: user.correo,
        displayName: user.displayName,
      },
      process.env.SESSION_SECRET!,
      { expiresIn: "1h" },
    );
  }

  verifySessionToken(token: string) {
    try {
      return jwt.verify(token, process.env.SESSION_SECRET!);
    } catch (error) {
      console.warn("Token de sesión inválido:", (error as Error).message);
      return null;
    }
  }
  async authenticateWithAzure(token: string) {
    const msalAccount = await verifyTokenWithMsal(token);
    if (!msalAccount) {
      throw new AppError(
        "MFAuthError",
        "NOT_FOUND",
        "No se pudo validar con Microsoft",
      );
    }
    const parsed = AzurePayloadSchema.parse({
      oid: msalAccount.homeAccountId?.split(".")[0],
      tid: msalAccount.tenantId,
      name: msalAccount.name,
      upn: msalAccount.username,
    });

    const { oid, tid, upn, name } = parsed;

    // 3️⃣ Buscar o crear el usuario interno
    const user = await this.findOrCreateUser({
      azureOid: oid,
      correo: upn,
      displayName: name,
      tenantId: tid,
    });

    // enviar datos al event bus o event grid o lo que sea que estemos usando
    ``;

    return user;
  }

  /**
   * Busca el usuario por OID o correo.
   * Si lo encuentra por correo, actualiza su OID y tenantId.
   * Si no existe, crea un nuevo registro en la tabla usuario autorizado (user)
   */
  private async findOrCreateUser(data: {
    azureOid: string;
    correo?: string;
    displayName?: string;
    tenantId: string;
  }) {
    const { azureOid, correo, displayName, tenantId } = data;
    let user = await userRepo.findByEmail(correo!);

    if (!user) {
      user = await userRepo.create({
        correo: correo ?? "",
        categoriaUsuarioId: ROLES.PROFESSORS,
        azureOid: azureOid,
        tenantId,
        activo: true,
      });
    }

    await userRepo.updateLastAccess(user!.id);

    return {
      ...user,
      azureOid,
      tenantId,
      displayName,
    };
  }
}

export const authService = new AuthService();
