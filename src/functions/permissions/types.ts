import { z } from "zod";

export const PermissionsSchema = z.object({
  silaboId: z.number().int().positive(),
  docenteId: z.number().int().positive(),
  sections: z
    .array(z.string().min(1, "El nombre de la sección no puede estar vacío"))
    .nonempty("Debes seleccionar al menos una sección"),
});
