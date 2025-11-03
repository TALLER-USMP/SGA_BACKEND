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

// =====================================================
// 🔹 RESPUESTA COMPLETA DEL SÍLABO
// =====================================================
export const CompleteSyllabusResponseSchema = z.object({
  // I. DATOS GENERALES
  datosGenerales: z.object({
    departamentoAcademico: z.string().nullable(),
    escuelaProfesional: z.string().nullable(),
    programaAcademico: z.string().nullable(),
    semestreAcademico: z.string().nullable(),
    areaCurricular: z.string().nullable(),
    codigoAsignatura: z.string().nullable(),
    nombreAsignatura: z.string().nullable(),
    tipoAsignatura: z.string().nullable(),
    tipoEstudios: z.string().nullable(),
    modalidad: z.string().nullable(),
    ciclo: z.string().nullable(),
    requisitos: z.string().nullable(),
    docentes: z.string().nullable(),

    // Horas
    horasTeoria: z.number().nullable(),
    horasPractica: z.number().nullable(),
    horasLaboratorio: z.number().nullable(),
    horasTotales: z.number().nullable(),

    // Créditos
    creditosTeoria: z.number().nullable(),
    creditosPractica: z.number().nullable(),
    creditosTotales: z.number().nullable(),
  }),

  // II. SUMILLA
  sumilla: z.string().nullable(),

  // III. COMPETENCIAS DEL CURSO
  competenciasCurso: z.array(
    z.object({
      id: z.number(),
      codigo: z.string().nullable(),
      descripcion: z.string(),
      orden: z.number().nullable(),
    }),
  ),

  // IV. COMPONENTES DE COMPETENCIAS
  componentesConceptuales: z.array(
    z.object({
      id: z.number(),
      codigo: z.string().nullable(),
      descripcion: z.string(),
      orden: z.number().nullable(),
    }),
  ),

  componentesProcedimentales: z.array(
    z.object({
      id: z.number(),
      codigo: z.string().nullable(),
      descripcion: z.string(),
      orden: z.number().nullable(),
    }),
  ),

  componentesActitudinales: z.array(
    z.object({
      id: z.number(),
      codigo: z.string().nullable(),
      descripcion: z.string(),
      orden: z.number().nullable(),
    }),
  ),

  // V. RESULTADOS DE APRENDIZAJE
  resultadosAprendizaje: z.array(
    z.object({
      id: z.number(),
      descripcion: z.string(),
      orden: z.number().nullable(),
    }),
  ),

  // VI. UNIDADES DIDÁCTICAS
  unidadesDidacticas: z.array(
    z.object({
      id: z.number(),
      numero: z.number(),
      titulo: z.string(),
      semanaInicio: z.number().nullable(),
      semanaFin: z.number().nullable(),
      contenidosConceptuales: z.string().nullable(),
      contenidosProcedimentales: z.string().nullable(),
      actividadesAprendizaje: z.string().nullable(),
      horasLectivasTeoria: z.number().nullable(),
      horasLectivasPractica: z.number().nullable(),
    }),
  ),

  // VII. ESTRATEGIAS METODOLÓGICAS
  estrategiasMetodologicas: z.string().nullable(),

  // VIII. RECURSOS DIDÁCTICOS
  recursosDidacticos: z.array(
    z.object({
      id: z.number(),
      recursoNombre: z.string(),
      destino: z.string().nullable(),
      observaciones: z.string().nullable(),
    }),
  ),

  // IX. EVALUACIÓN DEL APRENDIZAJE
  evaluacionAprendizaje: z.object({
    planEvaluacion: z.array(
      z.object({
        id: z.number(),
        componenteNombre: z.string(),
        instrumentoNombre: z.string().nullable(),
        semana: z.number().nullable(),
        fecha: z.string().nullable(),
      }),
    ),
    formulaEvaluacion: z.string().nullable(),
  }),

  // X. FUENTES DE INFORMACIÓN
  fuentes: z.array(
    z.object({
      id: z.number(),
      tipo: z.string(),
      autores: z.string().nullable(),
      anio: z.number().nullable(),
      titulo: z.string().nullable(),
      editorial: z.string().nullable(),
      ciudad: z.string().nullable(),
      isbn: z.string().nullable(),
      url: z.string().nullable(),
    }),
  ),

  // APORTE A RESULTADOS DEL PROGRAMA
  aportesResultadosPrograma: z.array(
    z.object({
      resultadoCodigo: z.string(),
      resultadoDescripcion: z.string().nullable(),
      aporteValor: z.string().nullable(),
    }),
  ),
});

export type CompleteSyllabusResponse = z.infer<
  typeof CompleteSyllabusResponseSchema
>;
