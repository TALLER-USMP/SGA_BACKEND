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
    .regex(
      /^[a-z]\.[1-9]\d*$/,
      "El codigo debe ser letra.numero, ejemplo g.1-g.2",
    ),
);

/* code actitudinales: una letra */
export const CodeSchemaAttitude = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z]$/, "Ingresa el codigo (a-z)");
//1
/* COMPONENTES */
export const CreateComponentsSchema = z.object({
  items: z
    .array(
      z.object({
        id: IdSchema.optional(),
        text: z.string().trim().min(1, "El campo 'text' es obligatorio"),
        code: CodeSchemaComponent.optional(), // ← tiene code
        order: OrderSchema,
      }),
    )
    .min(1, "El campo 'text' es obligatorio"),
});
export type CreateComponents = z.infer<typeof CreateComponentsSchema>;

/* ACTITUDINALES */
export const CreateAttitudesSchema = z.object({
  items: z
    .array(
      z.object({
        id: IdSchema.optional(),
        text: z.string().min(1, "El campo 'text' es obligatorio"),
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
          text: z.string().trim().min(1, "Deberias completar el campo 'text' "),
          // aquí puedes dejar solo letras/números simples:
          code: z
            .union([
              z.string().trim().min(1, "El campo 'code' es obligatorio"),
              z.number(),
            ])
            .transform((v) => v.toString().trim())
            .optional(),
          order: OrderSchema,
        }),
      )
      .min(1, "Deberias completar el campo 'text' "),
  })
  .strict();
export type UpsertCompetencies = z.infer<typeof UpsertCompetenciesSchema>;
