import { z } from "zod";

export const AzurePayloadSchema = z.object({
  oid: z.uuid(),
  tid: z.uuid(),
  upn: z.email().optional(),
  unique_name: z.email().optional(),
  name: z.string().optional(),
  aud: z.string().optional(),
  iss: z.url().optional(),
  exp: z.number().optional(),
  iat: z.number().optional(),
  scp: z.string().optional(),
});

export type AzurePayload = z.infer<typeof AzurePayloadSchema>;
