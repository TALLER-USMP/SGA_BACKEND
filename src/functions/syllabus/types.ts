import { z } from "zod";

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
