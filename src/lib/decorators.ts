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
      const allowedOrigins = [
        "https://lemon-moss-0c832d30f.1.azurestaticapps.net",
        "https://zealous-forest-09c221e0f.2.azurestaticapps.net",
        "http://localhost:5001",
        "http://localhost:5002",
      ];

      const origin = req.headers.get("origin");
      const corsOrigin =
        typeof origin === "string" && allowedOrigins.includes(origin)
          ? origin
          : allowedOrigins[0];

      const baseHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      };

      if (req.method === "OPTIONS") {
        return {
          status: 204,
          headers: baseHeaders, // debe ir dentro de headers
        };
      }

      try {
        const result = await originalMethod(req, context);
        return {
          ...result,
          headers: {
            ...baseHeaders,
            ...(result?.headers || {}),
          },
        };
      } catch (error: unknown) {
        if (error instanceof AppError) {
          return {
            status: error.statusCode,
            headers: baseHeaders,
            jsonBody: {
              message: error.message,
              name: error.name,
            },
          };
        }

        if (error instanceof ZodError) {
          return {
            status: STATUS_CODES.BAD_REQUEST,
            headers: baseHeaders,
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
            headers: baseHeaders,
            jsonBody: {
              name: error.name,
              message: error.message,
            },
          };
        }

        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          headers: baseHeaders,
          jsonBody: {
            name: "UnknownError",
            message: "Unknown error",
          },
        };
      }
    };
  };
}
