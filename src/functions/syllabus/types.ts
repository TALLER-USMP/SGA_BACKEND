import { z } from "zod";

// helper para order: acepta number, string numérico o null; normaliza a number | undefined
const OrderSchema = z
  .union([z.number().int().nonnegative(), z.string().regex(/^\d+$/), z.null()])
  .optional()
  .transform((v) => {
    if (v === null || typeof v === "undefined") return undefined;
    return typeof v === "string" ? Number(v) : v;
  });

export const CompetencyItemSchema = z
  .object({
    id: z.string().uuid().optional(),
    text: z.string().min(1, "text requerido"),
    code: z.string().min(1).optional(),
    order: OrderSchema, // ← usa el schema tolerante
  })
  .strict();

export const UpsertCompetenciesSchema = z
  .object({
    items: z.array(CompetencyItemSchema).min(1, "items requerido"),
  })
  .strict();

export type CompetencyItem = z.infer<typeof CompetencyItemSchema>;
export type UpsertCompetencies = z.infer<typeof UpsertCompetenciesSchema>;
