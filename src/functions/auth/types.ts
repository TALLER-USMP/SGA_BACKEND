import z from "zod";

// completar esquemas
export const loginRequestSchema = z.object({});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const sessionRequestSchema = z.object({});
export type SessionRequest = z.infer<typeof sessionRequestSchema>;

export const sessionResponseSchema = z.object({});
export type SessionResponse = z.infer<typeof sessionResponseSchema>;
