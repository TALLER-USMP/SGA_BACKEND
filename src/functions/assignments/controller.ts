import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Listable, Readable } from "../../types";
import { assignmentsService } from "./service";
import { listQueryParamsSchema } from "./types";
import { AppError } from "../../error";

@controller("assignments")
export class AssignmentsController implements Listable {
  /**
   * Ejemplos:
   * http://localhost:7071/api/assignments/?codigo=TEST101
   * http://localhost:7071/api/assignments/?nombre=Taller de Proyectos
   * http://localhost:7071/api/assignments/?idDocente=3
   */
  @route("/", "GET")
  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const codigo = req.query.get("codigo")?.trim() || undefined;
    const nombre = req.query.get("nombre")?.trim() || undefined;
    const idSilaboParam = req.query.get("idSilabo")?.trim() || undefined;
    const idDocenteParam = req.query.get("idDocente")?.trim() || undefined;
    const areaCurricular = req.query.get("areaCurricular")?.trim() || undefined;

    const validation = listQueryParamsSchema.safeParse({
      codigo,
      nombre,
      idSilabo: idSilaboParam,
      idDocente: idDocenteParam,
      areaCurricular: areaCurricular,
    });

    if (!validation.success) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Parámetros de consulta inválidos",
        validation.error.issues,
      );
    }

    const filters = validation.data;

    // Llamar al servicio
    const items = await assignmentsService.list({
      codigo: filters.codigo,
      nombre: filters.nombre,
      idSilabo: filters.idSilabo,
      idDocente: filters.idDocente,
      areaCurricular: filters.areaCurricular,
    });

    return {
      status: STATUS_CODES.OK,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        message: "Listado de sílabos obtenido correctamente.",
        data: items,
      },
    };
  }
}
