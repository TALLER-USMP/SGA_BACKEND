// src/functions/auth/controller.ts
import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Readable } from "../../types";
import { controller, route } from "../../lib/decorators";
import { AuthService } from "./service";
import {
  loginRequestSchema,
  loginResponseSchema,
  sessionResponseSchema,
} from "./types";
import { ZodError } from "zod";
// Importa AppError si necesitas manejar errores personalizados. Si no existe, puedes quitar la importación.
// import { AppError } from "../../error";

const authService = new AuthService();
const SESSION_COOKIE_NAME = "session_token";

function createAuthCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "Secure;" : "";
  const maxAge = 60 * 60 * 24 * 7;
  return `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Max-Age=${maxAge}; ${secure} SameSite=Strict; Path=/`;
}

function clearAuthCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
}

const getCookie = (req: HttpRequest, name: string): string | undefined => {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));

  return cookie ? cookie.substring(name.length + 1) : undefined;
};

@controller("auth")
export class AuthController implements Readable {
  @route("/login", "POST")
  async login(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    context.log(`Processing POST /auth/login.`);

    try {
      const body = await req.json();
      const { microsoftToken } = loginRequestSchema.parse(body);

      const authResponse = await authService.login(microsoftToken);

      const cookieHeader = createAuthCookieHeader(authResponse.token);
      const responseData = loginResponseSchema.parse(authResponse);

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
        jsonBody: {
          message: "Inicio de sesión exitoso",
          user: responseData.user,
          token: responseData.token,
        },
      };
    } catch (error) {
      context.error(error);

      // 👈 COMPROBACIÓN DE TIPO: Usamos instanceof para ZodError
      if (error instanceof ZodError) {
        return {
          status: 400,
          jsonBody: {
            message: "Error de validación en la solicitud",
            details: error.flatten(),
          },
        };
      }

      // 👈 COMPROBACIÓN DE TIPO: Para el resto, asumimos que es un objeto con propiedad 'message'
      // Esto cubre errores lanzados por el servicio (ej: 'Token no válido')
      const errorMessage =
        (error as { message?: string }).message ||
        "Fallo desconocido en la autenticación.";

      return {
        status: 401,
        jsonBody: {
          message: errorMessage,
        },
      };
    }
  }

  @route("/me")
  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    context.log(`Processing GET /auth/me.`);

    let ourToken: string | undefined;

    ourToken = getCookie(req, SESSION_COOKIE_NAME);

    if (!ourToken && req.query.get("token")) {
      ourToken = req.query.get("token") as string;
    }

    if (!ourToken) {
      return {
        status: 401,
        jsonBody: { message: "No estás logueado. Sesión no encontrada." },
      };
    }

    try {
      const authResponse = await authService.sessionMe(ourToken);

      const cookieHeader = createAuthCookieHeader(authResponse.token);
      const responseData = sessionResponseSchema.parse(authResponse);

      return {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieHeader,
        },
        jsonBody: {
          message: "Sesión activa",
          user: responseData.user,
          token: responseData.token,
        },
      };
    } catch (error) {
      context.error(error);

      const clearCookieHeader = clearAuthCookieHeader();

      // 👈 COMPROBACIÓN DE TIPO: Asumimos que es un objeto con propiedad 'message'
      const errorMessage =
        (error as { message?: string }).message ||
        "Sesión inválida o expirada.";

      return {
        status: 401,
        headers: {
          "Set-Cookie": clearCookieHeader,
        },
        jsonBody: {
          message: errorMessage,
        },
      };
    }
  }
}
