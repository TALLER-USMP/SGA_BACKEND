import jwt from "jsonwebtoken";

export class SessionService {
  static createSessionToken(user: any) {
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

  static verifySessionToken(token: string) {
    try {
      return jwt.verify(token, process.env.SESSION_SECRET!);
    } catch (error) {
      console.warn("Token de sesión inválido:", (error as Error).message);
      return null;
    }
  }
}
