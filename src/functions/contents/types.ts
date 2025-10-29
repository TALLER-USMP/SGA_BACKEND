import { z } from "zod";

/* ===========================================================
    TAREA 50 -  OBTENER UNIDADES POR CURSO (GET /:cursoCodigo)
   =========================================================== */
/**
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

/* ===========================================================
   LISTA DE UNIDADES DE UN SÍLABO
   =========================================================== */
export const unidadListItemSchema = z.object({
  id: z.number(),
  numero: z.number(),
  titulo: z.string(),
  semanaInicio: z.number().nullable(),
  semanaFin: z.number().nullable(),
  actividadesAprendizaje: z.string().nullable(),
});

export type UnidadListItem = z.infer<typeof unidadListItemSchema>;

/* ===========================================================
   TAREA 51 - (POST /api/programacion-contenidos)
   =========================================================== */
export const createUnidadSchema = z.object({
  silaboId: z.number().refine((val) => val !== undefined, {
    message: "El ID del sílabo es obligatorio",
  }),
  numero: z.number().refine((val) => val !== undefined, {
    message: "El número de unidad es obligatorio",
  }),
  titulo: z.string().min(1, "El título no puede estar vacío"),
  capacidadesText: z.string().nullable(),
  semanaInicio: z.number().nullable(),
  semanaFin: z.number().nullable(),
  contenidosConceptuales: z.string().nullable(),
  contenidosProcedimentales: z.string().nullable(),
  actividadesAprendizaje: z.string().nullable(),
  horasLectivasTeoria: z.number().nullable(),
  horasLectivasPractica: z.number().nullable(),
  horasNoLectivasTeoria: z.number().nullable(),
  horasNoLectivasPractica: z.number().nullable(),
});

export type CreateUnidadInput = z.infer<typeof createUnidadSchema>;

/* ===========================================================
   TAREA 52 - (PUT /api/programacion-contenidos/:id)
   =========================================================== */
export const updateUnidadParamsSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "El ID debe ser un número válido" }),
});

export const updateUnidadSchema = z.object({
  numero: z.number().optional(),
  titulo: z.string().optional(),
  capacidadesText: z.string().nullable().optional(),
  semanaInicio: z.number().nullable().optional(),
  semanaFin: z.number().nullable().optional(),
  contenidosConceptuales: z.string().nullable().optional(),
  contenidosProcedimentales: z.string().nullable().optional(),
  actividadesAprendizaje: z.string().nullable().optional(),
  horasLectivasTeoria: z.number().nullable().optional(),
  horasLectivasPractica: z.number().nullable().optional(),
  horasNoLectivasTeoria: z.number().nullable().optional(),
  horasNoLectivasPractica: z.number().nullable().optional(),
});

export type UpdateUnidadInput = z.infer<typeof updateUnidadSchema>;
export type UpdateUnidadParams = z.infer<typeof updateUnidadParamsSchema>;

/* ===========================================================
    AGRUPA TODOS LOS ESQUEMAS
   =========================================================== */
export type ProgramacionContenidosSchemas = {
  params: Params;
  listItem: UnidadListItem;
  createUnidad: CreateUnidadInput;
  updateUnidad: UpdateUnidadInput;
};
