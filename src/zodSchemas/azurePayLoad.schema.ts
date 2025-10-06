import { z } from "zod";

export const AzurePayloadSchema = z.object({
  oid: z.string().uuid(),
  tid: z.string().uuid(),
  upn: z.string().email().optional(),
  unique_name: z.string().email().optional(),
  name: z.string().optional(),
  aud: z.string().optional(),
  iss: z.string().url().optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
  scp: z.string().optional(),
});

export type AzurePayload = z.infer<typeof AzurePayloadSchema>;
