import { z } from "zod";

/**
 * ✅ Validación de parámetros de ruta
 * Ejemplo: /api/programacion-contenidos/09011906051
 */
export const paramsSchema = z.object({
  cursoCodigo: z
    .string()
    .min(1, { message: "El código de curso no puede estar vacío" })
    .max(20, {
      message: "El código de curso no puede tener más de 20 caracteres",
    }),
});

export type Params = z.infer<typeof paramsSchema>;

/**
 * ✅ Esquema para cada unidad del sílabo
 */
export const unidadListItemSchema = z.object({
  id: z.number(),
  numero: z.number(),
  titulo: z.string(),
  semanaInicio: z.number().nullable(),
  semanaFin: z.number().nullable(),
  actividadesAprendizaje: z.string().nullable(),
});

export type UnidadListItem = z.infer<typeof unidadListItemSchema>;
