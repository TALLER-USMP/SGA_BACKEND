import z from "zod";
import { authorizedUser, userCategory } from "../../../drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type AuthorizedUser = InferSelectModel<typeof authorizedUser>;
export type UserCategory = InferSelectModel<typeof userCategory>;

export interface MicrosoftJwtPayload {
  email: string;
  name: string;
  oid?: string;
  tid?: string;
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
