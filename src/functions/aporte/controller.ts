import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { aporteService } from "./service";
import { AporteCreateSchema } from "./types";

@controller("syllabus")
export class AporteController {
  // POST /api/syllabus/{silaboId}/aporte
  @route("/{silaboId}/aporte", "POST")
  async createAporte(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const { silaboId } = req.params as { silaboId: string };
      const body = (await req.json()) as Record<string, unknown>;

      // Validación con Zod
      const parsed = AporteCreateSchema.safeParse({
        ...(body || {}),
        silaboId: Number(silaboId),
      });

      if (!parsed.success) {
        return {
          status: 400,
          jsonBody: {
            message: "Datos inválidos en el cuerpo de la solicitud",
            errors: parsed.error.issues, // ✅ sin error TS
          },
        };
      }

      const aporteData = parsed.data;
      const result = await aporteService.createAporte(aporteData);

      return {
        status: 201,
        jsonBody: {
          message: "Aporte registrado correctamente",
          result,
        },
      };
    } catch (error) {
      console.error("Error al crear aporte:", error);
      return {
        status: 500,
        jsonBody: {
          message: "Error interno del servidor",
        },
      };
    }
  }
}
