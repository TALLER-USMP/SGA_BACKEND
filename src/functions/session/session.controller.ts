import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import jwt from "jsonwebtoken";
import { AuthService } from "../../service/auth.service";
import { AzurePayloadSchema } from "../../zodSchemas/azurePayLoad.schema"; // 👈 validamos con Zod
import { z } from "zod";
import { SessionService } from "../../service/session.service";
import { extractCookie } from "../../utils/cookie.utils";

@controller("session")
export class SessionController implements BaseController {
  private authService = new AuthService();

  @route("/create", "POST")
  async sessionCreate(
    req: HttpRequest,
    ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    // 🔹 1. Leer token desde Authorization header o JSON body
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

    const body = (await req.json().catch(() => ({}))) as {
      access_token?: string;
    };
    const token = bearerToken || body?.access_token;

    if (!token) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { error: "Falta el token de acceso" },
      };
    }

    try {
      const user = await this.authService.authenticateWithAzure(token);
      const sessionToken = SessionService.createSessionToken(user);

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: "Sesión creada correctamente",
          cookies: [
            {
              name: "session_token",
              value: sessionToken,
              httpOnly: true, // 🔒 No accesible desde JS
              secure: true, // 🔐 Solo por HTTPS
              sameSite: "Strict",
              path: "/",
              maxAge: 60 * 60, // 1 hora
            },
          ],
          jsonBody: {
            message: "Sesión creada correctamente",
            user: { nombre: user.displayName, correo: user.correo },
          },
        },
      };
    } catch (error) {
      ctx.error(`Error en sessionCreate: ${error}`);
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: {
          error: error instanceof Error ? error.message : "Error desconocido",
          message: "No se pudo crear la sesión",
        },
      };
    }
  }

  @route("/me")
  async sessionMe(
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const cookie = request.headers.get("cookie");
    if (!cookie) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "No autenticado" },
      };
    }

    const sessionToken = extractCookie(cookie, "session_token");
    if (!sessionToken) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "No autenticado" },
      };
    }

    const decoded = SessionService.verifySessionToken(sessionToken);
    if (!decoded) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "Sesión inválida o expirada" },
      };
    }

    return {
      status: STATUS_CODES.OK,
      jsonBody: { user: decoded },
    };
  }

  @route("/logout")
  async sessionLogout(): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.OK,
      cookies: [
        {
          name: "session_token",
          value: "",
          httpOnly: true,
          secure: true,
          sameSite: "Strict",
          path: "/",
          expires: new Date(0),
        },
      ],
      jsonBody: { message: "Sesión cerrada correctamente" },
    };
  }

  // Métodos no implementados
  list(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
  getOne(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
  create(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
  update(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
  delete(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
}
