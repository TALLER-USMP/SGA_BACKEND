import {
  HttpMethod,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { MetadataStore } from "./metadatastore";
import { AppError } from "../error";
import { STATUS_CODES } from "../status-codes";
import { ZodError } from "zod";
import * as jwt from "jsonwebtoken";
import { UserSession } from "../functions/auth/types";
import { getCookie } from "../functions/auth/utils";
import { RoleName, roleNamesToIds } from "../constants/roles";

export type RouteDefinition = {
  path: string;
  method: HttpMethod;
  handlerKey: string;
};

/**
 * This registers a normal class as a controller class to get started, and also registers the route prefix.
 * @param path Prefix of API route
 * @returns Class constructor
 */
export function controller<T extends { new (...args: any[]): any }>(
  prefix: string,
) {
  return (constructor: T) => {
    Reflect.defineMetadata("controller:prefix", prefix, constructor);
    const classes =
      Reflect.getMetadata("controller:class", MetadataStore) || [];
    classes.push(constructor);
    Reflect.defineMetadata("controller:class", classes, MetadataStore);
    return constructor;
  };
}

/**
 * Decorator to protect routes by role
 * @param allowedRoles Array of role names that are allowed to access this route
 * @returns Method decorator
 * @example
 * ```typescript
 * @requireRole('ADMIN', 'COORDINADOR')
 * async list(req: HttpRequest): Promise<HttpResponseInit> { ... }
 * ```
 */
export function requireRole(...allowedRoles: RoleName[]) {
  return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    // Convert role names to IDs at decoration time
    const allowedRoleIds = roleNamesToIds(allowedRoles);

    descriptor.value = async function (
      req: HttpRequest,
      context: InvocationContext,
    ): Promise<HttpResponseInit> {
      // Extract token from cookie, query param, or body
      let token =
        getCookie(req.headers, "sessionSGA") || req.query.get("token") || null;

      if (!token) {
        const body = (await req.json().catch(() => ({}))) as { token?: string };
        token = body.token ?? null;
      }

      if (!token) {
        throw new AppError(
          "Unauthorized",
          "UNAUTHORIZED",
          "Token de autenticación requerido",
        );
      }

      // Verify and decode JWT
      let decoded: UserSession;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserSession;
      } catch (error) {
        throw new AppError(
          "Unauthorized",
          "UNAUTHORIZED",
          "Token inválido o expirado",
        );
      }

      // Check if user role is allowed
      if (!allowedRoleIds.includes(decoded.role)) {
        throw new AppError(
          "Forbidden",
          "FORBIDDEN",
          `No tienes permisos para acceder a este recurso. Roles permitidos: ${allowedRoles.join(", ")}`,
        );
      }

      // Attach user session to request for use in the handler
      (req as any).user = decoded;

      // Call original method
      return originalMethod.call(this, req, context);
    };

    return descriptor;
  };
}

/**
 * Define an api route and a handler based on the class method
 * @param path Route path for API
 * @param method Http method for APi
 * @returns
 */
export function route(path: string, method: HttpMethod = "GET") {
  return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
    const routes: RouteDefinition[] =
      Reflect.getMetadata("controller:routes", target.constructor) || [];
    routes.push({
      handlerKey,
      method,
      path,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
    const originalMethod = descriptor.value;
    descriptor.value = async function (
      req: HttpRequest,
      context: InvocationContext,
    ): Promise<HttpResponseInit> {
      const responseHeaders: Record<string, string> = {
        "Access-Control-Allow-Credentials": "true",
      };

      if (req.method === "OPTIONS") {
        return {
          status: 204,
          headers: responseHeaders,
        };
      }

      try {
        const result = await originalMethod.call(this, req, context);

        if (result?.headers) {
          if (result.headers instanceof Headers) {
            result.headers.forEach((value: string, key: string | number) => {
              responseHeaders[key] = value;
            });
          } else {
            Object.assign(responseHeaders, result.headers);
          }
        }

        return {
          ...result,
          headers: responseHeaders,
        };
      } catch (error: unknown) {
        if (error instanceof AppError) {
          return error.toHttpResponse();
        }

        if (error instanceof ZodError) {
          return {
            status: STATUS_CODES.BAD_REQUEST,
            headers: responseHeaders,
            jsonBody: {
              message: `Bad Request on ${handlerKey}`,
              name: "BadRequest",
              data: error.issues,
            },
          };
        }

        if (error instanceof Error) {
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            headers: responseHeaders,
            jsonBody: {
              name: error.name,
              message: error.message,
            },
          };
        }

        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          headers: responseHeaders,
          jsonBody: {
            name: "UnknownError",
            message: "Unknown error",
          },
        };
      }
    };
  };
}
