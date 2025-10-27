import { z } from "zod";

export const ContributionCreateSchema = z.object({
  silaboId: z.number().min(1, { message: "El ID del sílabo es obligatorio" }),
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
