import { z } from "zod";

export const TokenSchema = z.object({
  token: z.string().min(20, "Token inválido"),
});
export type Token = z.infer<typeof TokenSchema>;
