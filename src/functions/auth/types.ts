import z from "zod";
import { docente, categoriaUsuario } from "../../../drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type Professor = InferSelectModel<typeof docente>;
export type UserCategory = InferSelectModel<typeof categoriaUsuario>;

export interface MicrosoftJwtPayload {
  aud: string; // ID de la app (client_id)
  iss: string; // Emisor (tenant endpoint)
  iat: number; // Fecha de emisión (epoch)
  nbf: number; // No válido antes de (epoch)
  exp: number; // Fecha de expiración (epoch)
  name: string; // Nombre completo del usuario
  nonce: string; // Nonce usado en el flujo de autenticación
  oid: string; // Object ID del usuario en Azure AD
  preferred_username: string; // Usualmente email o UPN
  rh: string; // Refresh handle interno de MS
  sid: string; // Session ID
  sub: string; // Subject ID (único por usuario y app)
  tid: string; // Tenant ID
  uti: string; // ID de token único
  ver: string; // Versión del token (2.0)
}

// Esquema para la entrada del POST /auth/login/
export const loginRequestSchema = z.object({
  // El token de Microsoft debe ser una cadena no vacía
  microsoftToken: z.string().min(1, "El token de Microsoft es requerido."),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

// Esquema para la salida del POST /auth/login/ y GET /auth/me/
export const userSessionSchema = z.object({
  id: z.number().int().positive(),
  email: z.email(),
  role: z.number().int().positive(),
  name: z.string().min(1).nullable(),
});
export type UserSession = z.infer<typeof userSessionSchema>;

export const loginResponseSchema = z.object({
  token: z.string().min(1), // Nuestro JWT de sesión
  user: userSessionSchema,
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const sessionRequestSchema = z.object({});
export type SessionRequest = z.infer<typeof sessionRequestSchema>;

export const sessionResponseSchema = loginResponseSchema;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;

export const setCookieSchema = z.object({
  token: z.string(),
});
