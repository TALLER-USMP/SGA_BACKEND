import { z } from "zod";

export const MessageSchema = z.object({
  to: z.string(),
  codeAsignaure: z.string(),
  message: z.string().min(1).max(400),
});
