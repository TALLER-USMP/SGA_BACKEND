// types.ts
import { z } from "zod";

/* comunes */
export const OrderSchema = z
  .union([z.number().int().nonnegative(), z.string().regex(/^\d+$/), z.null()])
  .optional()
  .transform((v) => {
    if (v === null || v === undefined) return undefined;
    return typeof v === "string" ? Number(v) : v;
  });

export const IdSchema = z
  .union([z.number().int().positive(), z.string().regex(/^\d+$/)])
  .transform((v) => (typeof v === "string" ? Number(v) : v))
  .optional();

/* code componentes: letra.número */
export const CodeSchemaComponent = z.preprocess(
  (v) => {
    const s =
      typeof v === "number" ? String(v) : typeof v === "string" ? v : "";
    const raw = s.toLowerCase().trim();
    const m = raw.match(/^([a-z])[\s._-]*([0-9]+)$/);
    if (m) return `${m[1]}.${Number(m[2])}`;
    return raw;
  },
  z
    .string()
    .regex(/^[a-z]\.[1-9]\d*$/, "code debe ser letra.numero, p. ej. g.1"),
);

/* code actitudinales: una letra */
export const CodeSchemaAttitude = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]$/, "code debe ser una sola letra (a–z)");

/* COMPONENTES */
export const CreateComponentsSchema = z.object({
  items: z
    .array(
      z.object({
        id: IdSchema.optional(),
        text: z.string().min(1, "text requerido"),
        code: CodeSchemaComponent.optional(), // ← tiene code
        order: OrderSchema,
      }),
    )
    .min(1, "items requerido"),
});
export type CreateComponents = z.infer<typeof CreateComponentsSchema>;

/* ACTITUDINALES */
export const CreateAttitudesSchema = z.object({
  items: z
    .array(
      z.object({
        id: IdSchema.optional(),
        text: z.string().min(1, "text requerido"),
        code: CodeSchemaAttitude.optional(),
        order: OrderSchema,
      }),
    )
    .min(1, "items requerido"),
});
export type CreateAttitudes = z.infer<typeof CreateAttitudesSchema>;

/* COMPETENCIAS (si tu service usa UpsertCompetenciesSchema, expórtalo aquí) */
export const UpsertCompetenciesSchema = z
  .object({
    items: z
      .array(
        z.object({
          id: IdSchema.optional(),
          text: z.string().trim().min(1),
          // aquí puedes dejar solo letras/números simples:
          code: z
            .union([z.string().trim().min(1), z.number()])
            .transform((v) => v.toString().trim())
            .optional(),
          order: OrderSchema,
        }),
      )
      .min(1, "items requerido"),
  })
  .strict();
export type UpsertCompetencies = z.infer<typeof UpsertCompetenciesSchema>;
