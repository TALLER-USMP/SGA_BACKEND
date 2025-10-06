import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Verificar token de acceso
export async function verifyTokenWithMsal(token: string) {
  try {
    const result = await cca.acquireTokenOnBehalfOf({
      oboAssertion: token,
      scopes: [`${process.env.AZURE_AUDIENCE!}/access`],
    });
    return result?.account;
  } catch (error) {
    throw new Error(`Token inválido o expirado: ${(error as Error).message}`);
  }
}
