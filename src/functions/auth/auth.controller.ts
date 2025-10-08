import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { controller, route } from "../../lib/decorators";
import { authService } from "../../service/auth.service";
import { STATUS_CODES } from "../../status-codes";
import { extractCookie } from "../../utils/cookie.utils";
import { AppError } from "../../error";

@controller("auth")
export class AuthController implements BaseController {
  @route("/create", "POST")
  async create(req: HttpRequest): Promise<HttpResponseInit> {
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");
    const bearerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;
    const token = bearerToken;
    if (!token) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { error: "Falta el token de acceso" },
      };
    }
    try {
      const user = await authService.authenticateWithAzure(token);
      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: "Sesión creada correctamente",
          jsonBody: {
            message: "Sesión creada correctamente",
            user: { nombre: user.displayName, correo: user.correo },
          },
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          jsonBody: {
            name: error.name,
            message: error.message,
          },
        };
      }
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: {
          error: "Error desconocido",
          message: "No se pudo crear la sesión",
        },
      };
    }
  }

  @route("/me")
  async getOne(request: HttpRequest): Promise<HttpResponseInit> {
    const cookie = request.headers.get("cookie");

    if (!cookie) {
      const sessionId = request.query.get("sessionId");
      // sessionId  y por el message type = user_loggedin
      const messageFinded = null;
      if (!messageFinded) {
        return {
          status: STATUS_CODES.UNAUTHORIZED,
          jsonBody: { message: "No autenticado" },
        };
      }

      // CREAR COOKIE
      return {
        status: STATUS_CODES.OK,
        jsonBody: messageFinded,
      };
    }

    const sessionToken = extractCookie(cookie, "session_token");
    if (!sessionToken) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "No autenticado" },
      };
    }

    const decoded = authService.verifySessionToken(sessionToken);
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

  @route("/logout", "POST")
  async logout(): Promise<HttpResponseInit> {
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

  list(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }

  update(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
  delete(): Promise<HttpResponseInit> {
    throw new Error("Not implemented");
  }
}
