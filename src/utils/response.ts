import { HttpResponseInit } from "@azure/functions";

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export function createResponse<T>(
  status: number,
  success: boolean,
  message: string,
  data?: T,
): HttpResponseInit {
  const body: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
  };

  return {
    status,
    jsonBody: body,
    headers: { "Content-Type": "application/json" },
  };
}

export const response = {
  ok<T>(message: string, data?: T) {
    return createResponse(200, true, message, data);
  },
  created<T>(message: string, data?: T) {
    return createResponse(201, true, message, data);
  },
  badRequest(message: string) {
    return createResponse(400, false, message);
  },
  notFound(message: string) {
    return createResponse(404, false, message);
  },
  serverError(message = "Error interno del servidor") {
    return createResponse(500, false, message);
  },
};
