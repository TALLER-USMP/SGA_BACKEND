import { z } from "zod";

// Schema para los filtros de búsqueda
export const silaboFiltersSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  idSilabo: z.number().int().positive().optional(),
  idDocente: z.number().int().positive().optional(),
});
export type SilaboFilters = z.infer<typeof silaboFiltersSchema>;

// Schema para un item de la lista de sílabos
export const silaboListItemSchema = z.object({
  cursoCodigo: z.string().nullable(),
  cursoNombre: z.string().nullable(),
  estadoRevision: z.string().nullable(),
  syllabusId: z.number().int().positive(),
  docenteId: z.number().int().positive().nullable(),
});
export type SilaboListItem = z.infer<typeof silaboListItemSchema>;

// Schema para validar query params del GET
export const listQueryParamsSchema = z.object({
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  idSilabo: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (v) => v === undefined || (Number.isInteger(v) && v > 0),
      "idSilabo inválido",
    ),
  idDocente: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine(
      (v) => v === undefined || (Number.isInteger(v) && v > 0),
      "idDocente inválido",
    ),
});
