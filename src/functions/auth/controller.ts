import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Readable } from "../../types";
import { authService } from "./service";
import {
  loginRequestSchema,
  loginResponseSchema,
  sessionResponseSchema,
} from "./types";
import { createAuthCookieHeader, getCookie } from "./utils";

@controller("auth")
export class AuthController implements Readable {
  @route("/login", "POST")
  async login(req: HttpRequest): Promise<HttpResponseInit> {
    const body = await req.json();
    const { microsoftToken } = loginRequestSchema.parse(body);
    const { mailToken } = loginRequestSchema.parse(body);
    const authResponse = await authService.login(microsoftToken);
    const responseData = loginResponseSchema.parse(authResponse);

    return {
      status: STATUS_CODES.OK,
      headers: {
        "Content-Type": "application/json",
      },
      jsonBody: {
        message: "Inicio de sesión exitoso",
        user: responseData.user,
        url: `${process.env.DASHBOARD_URL}/?token=${responseData.token}&mailToken=${mailToken}`,
      },
    };
  }

  @route("/me", "POST")
  async getOne(req: HttpRequest): Promise<HttpResponseInit> {
    const tokenFromCookie = getCookie(req.headers, "sessionSGA");
    const tokenFromQuery = req.query.get("token");
    const body = (await req.json().catch(() => ({}))) as { token?: string };
    const tokenFromBody = body.token;

    const token = tokenFromCookie || tokenFromQuery || tokenFromBody || null;

    if (!token) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "Token requerido o sesión no encontrada." },
      };
    }

    const isValid = await authService.isTokenValid(token);
    if (!isValid) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "Token inválido o expirado." },
      };
    }

    const authResponse = await authService.sessionMe(token);
    const responseData = sessionResponseSchema.parse(authResponse);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (!tokenFromCookie && token) {
      headers["Set-Cookie"] = createAuthCookieHeader(token);
    }

    return {
      status: STATUS_CODES.OK,
      headers,
      jsonBody: {
        message: "Sesión activa",
        user: responseData.user,
        token: responseData.token,
      },
    };
  }

  @route("/logout", "POST")
  async logout(req: HttpRequest): Promise<HttpResponseInit> {
    let currentToken =
      getCookie(req.headers, "sessionSGA") || req.query.get("token") || null;

    if (!currentToken) {
      const body = (await req.json().catch(() => ({}))) as { token?: string };
      currentToken = body.token ?? null;
    }

    const cookieHeader = createAuthCookieHeader("", { maxAge: 0 });

    return {
      status: STATUS_CODES.OK,
      headers: {
        "Set-Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      jsonBody: {
        message: "Sesión cerrada",
      },
    };
  }
}
