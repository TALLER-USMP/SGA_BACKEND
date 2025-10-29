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
    const cookieToken = getCookie(req.headers, "sessionSGA");
    const queryToken = req.query.get("token");
    const body = (await req.json().catch(() => ({}))) as { token?: string };
    const bodyToken = body.token;

    const ourToken = bodyToken || queryToken || cookieToken;

    if (!ourToken) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "Token requerido o sesión no encontrada." },
      };
    }

    const cookieHeader = createAuthCookieHeader(ourToken);
    const authResponse = await authService.sessionMe(ourToken);
    const responseData = sessionResponseSchema.parse(authResponse);

    return {
      status: STATUS_CODES.OK,
      headers: {
        "Set-Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
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
