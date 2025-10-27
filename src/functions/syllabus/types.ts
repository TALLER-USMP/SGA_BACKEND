// types.ts
import { z } from "zod";

//---------------------------
export const SyllabusCreateSchema = z.object({
  nombreAsignatura: z.string(),
  departamentoAcademico: z.string(),
  escuelaProfesional: z.string(),
  programaAcademico: z.string(),
  semestreAcademico: z.string(),
  tipoAsignatura: z.string(),
  tipoEstudios: z.string(),
  modalidad: z.string(),
  codigoAsignatura: z.string(),
  ciclo: z.string(),
  requisitos: z.string(),

  // 🔹 Campos de horas
  horasTeoria: z.number(),
  horasPractica: z.number(),
  horasLaboratorio: z.number().nullable().optional(),
  horasTotales: z.number(),

  horasTeoriaLectivaPresencial: z.number().nullable().optional(),
  horasTeoriaLectivaDistancia: z.number().nullable().optional(),
  horasTeoriaNoLectivaPresencial: z.number().nullable().optional(),
  horasTeoriaNoLectivaDistancia: z.number().nullable().optional(),

  horasPracticaLectivaPresencial: z.number().nullable().optional(),
  horasPracticaLectivaDistancia: z.number().nullable().optional(),
  horasPracticaNoLectivaPresencial: z.number().nullable().optional(),
  horasPracticaNoLectivaDistancia: z.number().nullable().optional(),

  // 🔹 Campos de créditos
  creditosTeoria: z.number(),
  creditosPractica: z.number(),
  creditosTotales: z.number(),
});

export const SumillaSchema = z.object({
  sumilla: z
    .string()
    .min(1, { message: "La sumilla es obligatoria y debe ser texto" })
    .refine((val) => val.trim().split(/\s+/).length >= 80, {
      message: "La sumilla debe tener al menos 80 palabras",
    }),
});
//----------------------------

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

// =====================================================
// 🔹 APORTES
// =====================================================
export const ContributionCreateSchema = z.object({
  syllabusId: z.number().min(1, { message: "El ID del sílabo es obligatorio" }),
  resultadoProgramaCodigo: z
    .string()
    .min(1, { message: "El código del resultado del programa es obligatorio" }),
  resultadoProgramaDescripcion: z.string().optional(),
  aporteValor: z
    .enum(["K", "R", ""], {
      message: "El aporte solo puede ser 'K', 'R' o vacío",
    })
    .optional()
    .default(""),
});

export type ContributionCreateType = z.infer<typeof ContributionCreateSchema>;
