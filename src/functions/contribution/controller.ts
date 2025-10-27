import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { contributionService } from "./service";
import { ContributionCreateSchema } from "./types";

@controller("syllabus")
export class ContributionController {
  // POST /api/syllabus/{silaboId}/aporte
  @route("/{syllabusId}/contribution", "POST")
  async createContribution(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { silaboId } = req.params as { silaboId: string };
    const body = (await req.json()) as Record<string, unknown>;

    // Validación con Zod
    const parsed = ContributionCreateSchema.safeParse({
      ...(body || {}),
      silaboId: Number(silaboId),
    });

    if (!parsed.success) {
      return {
        status: 400,
        jsonBody: {
          message: "Datos inválidos en el cuerpo de la solicitud",
          errors: parsed.error.issues,
        },
      };
    }

    const aporteData = parsed.data;
    const result = await contributionService.createAporte(aporteData);

    return {
      status: 201,
      jsonBody: {
        message: "Aporte registrado correctamente",
        result,
      },
    };
  }
}
