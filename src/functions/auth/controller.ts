// src/functions/auth/controller.ts
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
    const authResponse = await authService.login(microsoftToken);
    const cookieHeader = createAuthCookieHeader(authResponse.token);
    const responseData = loginResponseSchema.parse(authResponse);

    return {
      status: STATUS_CODES.OK,
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
  }

  @route("/me")
  async getOne(req: HttpRequest): Promise<HttpResponseInit> {
    let ourToken = getCookie(req.headers);
    if (!ourToken && req.query.get("token")) {
      ourToken = req.query.get("token");
    }

    if (!ourToken) {
      return {
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "No estás logueado. Sesión no encontrada." },
      };
    }

    const authResponse = await authService.sessionMe(ourToken);
    const cookieHeader = createAuthCookieHeader(authResponse.token);
    const responseData = sessionResponseSchema.parse(authResponse);

    return {
      status: STATUS_CODES.OK,
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
  }
}
