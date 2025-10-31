import { z } from "zod";

export const docenteStatusSchema = z.object({
  idDocente: z.string().min(1, "idDocente es obligatorio"),
  estadoRevision: z.string().min(1, "estadoRevision es obligatorio"),
});
