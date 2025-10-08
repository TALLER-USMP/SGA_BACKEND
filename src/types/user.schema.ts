import { z } from "zod";

const AuthLevels = ["Alumno", "Docente Contratado"] as const;
export type AuthLevel = (typeof AuthLevels)[number];

// Claims típicos de Entra ID
const RawTokenSchema = z.object({
  sub: z.string(),
  exp: z.number(),
  email: z.string().email().optional(),
  upn: z.string().email().optional(),
  preferred_username: z.string().email().optional(),
  roles: z.array(z.string()).optional(),
  scp: z.string().optional(),
});

// Nuestro payload de dominio
export const AuthPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: z.enum(AuthLevels),
  exp: z.number(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;

// Mapper: Azure token → AuthPayload
export function mapAzureTokenToAuthPayload(decoded: any): {
  email: string;
  role: AuthLevel;
  name?: string;
} {
  return {
    email: decoded.preferred_username || decoded.email || "",
    role: decoded.roles?.[0] as AuthLevel, // tomar el primer rol
    name: decoded.name,
  };
}
