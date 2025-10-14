import * as jwt from "jsonwebtoken";
import {
  MicrosoftJwtPayload,
  LoginResponse,
  AuthorizedUser,
  UserCategory,
  UserSessionData,
  SessionResponse,
} from "./types";
import * as authRepo from "./repository";

// =========================================================================
// 🛑 VALORES DIRECTOS DE PRUEBA (SOLUCIÓN TEMPORAL NO RECOMENDADA EN PROD)
// =========================================================================

const AZURE_TENANT_ID = "98201fef-d9f6-4e68-84f5-c2705074e342";

// 🛑 ¡CORRECCIÓN FINAL! USAR EL VALOR UNIVERSAL DE AUDIENCIA DEL GRAPH TOKEN
const AZURE_AUDIENCE = "00000003-0000-0000-c000-000000000000";

const OUR_JWT_SECRET =
  "dev_local_secret_shh_dont_tell_anyone_z7y2PqRk9TgFwEa8BsX4CdV6Hj";

// El Emisor (ISS) ahora coincide con el valor leído:
const MS_ISSUER = `https://sts.windows.net/${AZURE_TENANT_ID}/`;

// =========================================================================

export class AuthService {
  private validateMicrosoftJwt(msToken: string): MicrosoftJwtPayload {
    try {
      const decoded: any = jwt.decode(msToken);

      // 🛑 LÍNEAS DE DIAGNÓSTICO: Muestran los valores leídos del token.
      console.log("DIAGNÓSTICO ISS LEÍDO:", decoded.iss);
      console.log("DIAGNÓSTICO AUD LEÍDO:", decoded.aud);

      // 1. Verificar el Emisor (Issuer)
      if (!decoded || decoded.iss !== MS_ISSUER) {
        // 🛑 Si esta falla, usa el valor de 'DIAGNÓSTICO ISS LEÍDO' para corregir MS_ISSUER.
        throw new Error("JWT de Microsoft no válido. Emisor (iss) incorrecto.");
      }

      // 2. Verificar la Audiencia (Audience)
      if (decoded.aud !== AZURE_AUDIENCE) {
        // 🛑 Si esta falla, usa el valor de 'DIAGNÓSTICO AUD LEÍDO' para corregir AZURE_AUDIENCE.
        throw new Error(
          "JWT de Microsoft no válido. Audiencia (aud) incorrecta.",
        );
      }

      // 3. Verificar la firma (asumida para el entorno de pruebas)
      // ...

      return {
        email: decoded.email || decoded.upn,
        name: decoded.name || "Usuario",
        oid: decoded.oid,
        tid: decoded.tid,
      } as MicrosoftJwtPayload;
    } catch (error) {
      console.error("Error al validar/decodificar JWT de Microsoft:", error);
      throw new Error("Token de autenticación de Microsoft no es válido.");
    }
  }

  private generateOurJwt(user: AuthorizedUser, rol: string): string {
    const payload: UserSessionData = {
      id: user.id,
      correo: user.correo,
      rol: rol,
    };

    return jwt.sign(payload, OUR_JWT_SECRET, { expiresIn: "1d" });
  }

  public async login(msToken: string): Promise<LoginResponse> {
    const msPayload = this.validateMicrosoftJwt(msToken);
    const userEmail = msPayload.email.toLowerCase();

    let userRecord = await authRepo.findUserByEmail(userEmail);

    if (userRecord) {
      await authRepo.updateLastAccess(userRecord.user.id, msPayload);
    } else {
      userRecord = await authRepo.createUser(msPayload);
    }

    const ourToken = this.generateOurJwt(
      userRecord.user,
      userRecord.category.nombreCategoria,
    );

    return {
      token: ourToken,
      user: {
        id: userRecord.user.id,
        correo: userRecord.user.correo,
        rol: userRecord.category.nombreCategoria,
      },
    } as LoginResponse;
  }

  public async sessionMe(ourToken: string): Promise<SessionResponse> {
    try {
      const decoded = jwt.verify(ourToken, OUR_JWT_SECRET) as UserSessionData;
      const userId = decoded.id;

      const userAndCategory = await authRepo.findUserByEmail(decoded.correo);

      if (!userAndCategory || !userAndCategory.user.activo) {
        throw new Error("Usuario inactivo o no encontrado.");
      }

      const newToken = this.generateOurJwt(
        userAndCategory.user,
        userAndCategory.category.nombreCategoria,
      );
      await authRepo.updateOnlyLastAccess(userId);

      return {
        token: newToken,
        user: {
          id: userAndCategory.user.id,
          correo: userAndCategory.user.correo,
          rol: userAndCategory.category.nombreCategoria,
        },
      } as SessionResponse;
    } catch (error) {
      console.error("Error en /auth/me/ o token inválido:", error);
      throw new Error("Token de sesión no es válido o ha expirado.");
    }
  }
}
