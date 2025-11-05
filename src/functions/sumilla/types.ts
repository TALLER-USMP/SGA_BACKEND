import { z } from "zod";

export const CreateSumillaSchema = z.object({
  silaboId: z.number().int().positive(),
  contenido: z
    .string()
    .min(10, "El contenido debe tener al menos 10 caracteres"),
  palabrasClave: z.string().nullable().optional(),
});

export type CreateSumilla = z.infer<typeof CreateSumillaSchema>;

export const SumillaResponseSchema = z.object({
  id: z.number().int().positive(),
  silaboId: z.number().int().positive(),
  contenido: z.string(),
  palabrasClave: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type SumillaResponse = z.infer<typeof SumillaResponseSchema>;
