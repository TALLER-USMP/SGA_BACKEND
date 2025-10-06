import { HttpMethod, HttpRequest, InvocationContext } from "@azure/functions";
import { BaseController } from "../base-controller";
import { STATUS_CODES } from "../status-codes";
import { MetadataStore } from "./metadatastore";
import { SessionService } from "../service/session.service";
import { UserRepository } from "../repositories/user.repository";
import { extractCookie } from "../utils/cookie.utils";

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
export function controller<T extends { new (...args: any[]): BaseController }>(
  prefix: string,
) {
  return (constructor: T) => {
    Reflect.defineMetadata("controller:prefix", prefix, constructor);

    const classes =
      Reflect.getMetadata("controller:class", MetadataStore) || []; // 2
    // [SylabussController, ReportController] // 2

    classes.push(constructor); // [RerportController, SyllabusContrller, TestController] 3

    Reflect.defineMetadata("controller:class", classes, MetadataStore); // actualizo // 3

    return constructor;
  };
}

/**
 * Define an api route and a handler based on the class method
 * @param path Route path for API
 * @param method Http method for APi
 * @returns
 */
export function route(path: string, method: HttpMethod = "GET") {
  return (target: any, handlerKey: string) => {
    const routes: RouteDefinition[] =
      Reflect.getMetadata("controller:routes", target.constructor) || [];
    routes.push({
      handlerKey,
      method,
      path,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

const userRepo = new UserRepository();

export function auth(allowedRoles: string[]) {
  return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (req: HttpRequest, ctx: InvocationContext) => {
      try {
        // Obtener token desde Header o Cookie
        const authHeader =
          req.headers.get("authorization") || req.headers.get("Authorization");
        const cookieHeader = req.headers.get("cookie");

        const token = authHeader?.startsWith("Bearer ")
          ? authHeader.substring(7)
          : extractCookie(cookieHeader, "session_token");

        if (!token) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token de sesión no proporcionado" },
          };
        }

        const decoded = SessionService.verifySessionToken(token);
        if (!decoded || typeof decoded === "string") {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token inválido o expirado" },
          };
        }

        const { oid, tenantId } = decoded as any;
        if (!oid || !tenantId) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token sin información válida de usuario" },
          };
        }

        const user = await userRepo.findWithCategory(oid, tenantId);
        if (!user) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Usuario no registrado o no autorizado" },
          };
        }

        if (!user.activo) {
          return {
            status: STATUS_CODES.FORBIDDEN,
            jsonBody: { message: "Usuario inactivo" },
          };
        }

        const role = user.categoria?.nombre_categoria;
        if (!role || !allowedRoles.includes(role)) {
          return {
            status: STATUS_CODES.FORBIDDEN,
            jsonBody: {
              message: `Acceso denegado. Rol requerido: ${allowedRoles.join(
                ", ",
              )}`,
            },
          };
        }

        (ctx as any).user = user;

        return await originalMethod(req, ctx);
      } catch (error) {
        console.error("Error en decorador @auth:", error);
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          jsonBody: { message: "Error interno de autenticación" },
        };
      }
    };
  };
}
