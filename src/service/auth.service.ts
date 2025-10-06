import { verifyTokenWithMsal } from "../utils/verifyTokenAzureMsal.utils";
import { AzurePayloadSchema } from "../zodSchemas/azurePayLoad.schema";
import { UserRepository } from "../repositories/user.repository";

export class AuthService {
  private userRepo = new UserRepository();

  async authenticateWithAzure(token: string) {
    // 1️⃣ Verificar el token con MSAL (contacta a Azure AD)
    const msalAccount = await verifyTokenWithMsal(token);

    // 2️⃣ Validar y transformar con Zod
    if (!msalAccount) {
      throw new Error(
        "No se pudo verificar el token: msalAccount es null o undefined",
      );
    }

    const parsed = AzurePayloadSchema.safeParse({
      oid: msalAccount.homeAccountId?.split(".")[0],
      tid: msalAccount.tenantId,
      name: msalAccount.name,
      upn: msalAccount.username, // el "email"
    });

    if (!parsed.success) {
      console.error(parsed.error.flatten());
      throw new Error("Token MSAL inválido o con datos incompletos");
    }

    const { oid, tid, upn, name } = parsed.data;

    // 3️⃣ Buscar o crear el usuario interno
    const user = await this.findOrCreateUser({
      azureOid: oid,
      correo: upn,
      displayName: name,
      tenantId: tid,
    });

    return user;
  }

  /**
   * Busca el usuario por OID o correo.
   * Si lo encuentra por correo, actualiza su OID y tenantId.
   * Si no existe, crea un nuevo registro.
   */
  private async findOrCreateUser(data: {
    azureOid: string;
    correo?: string;
    displayName?: string;
    tenantId: string;
  }) {
    const { azureOid, correo, displayName, tenantId } = data;

    // 1️⃣ Buscar por Azure OID + tenant
    let user = await this.userRepo.findByOidAndTenant(azureOid, tenantId);

    // 2️⃣ Si no existe, intentar encontrarlo por correo
    if (!user && correo) {
      user = await this.userRepo.findByEmail(correo);

      if (user) {
        await this.userRepo.updateOidAndTenant(user.id, azureOid, tenantId);
        console.log(`🔄 Usuario vinculado con OID ${azureOid}`);
      }
    }

    // aqui falta añador nombre en la bd y displayName que se obtiene del payload de azure
    if (!user) {
      user = await this.userRepo.create({
        correo: correo ?? "",
        categoriaUsuarioId: 1, // o el ID por defecto de la categoría "usuario base"
        azureOid: azureOid,
        tenantId,
        activo: true,
      });
      console.log(`🆕 Usuario creado: ${correo}`);
    }

    if (user) {
      await this.userRepo.updateLastAccess(user.id);
    }

    return {
      ...user,
      azureOid,
      tenantId,
      displayName,
    };
  }
}
