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
import { merge } from "zod/v4/core/util.cjs";

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

// export function protected(role: ) {
//   return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
//     // TODO: Implementar autenticación
//   };
// }

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
