import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Readable } from "../../types";
import { contentsService } from "./service";

@controller("programacion-contenidos")
export class ContentsController implements Readable {
  /**
   * GET /api/programacion-contenidos/:cursoCodigo
   * ✅ Devuelve las unidades, semanas y actividades por curso
   */
  @route("/{cursoCodigo}", "GET")
  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const cursoCodigo = req.params.cursoCodigo;

    const data = await contentsService.list(cursoCodigo);

    return {
      status: STATUS_CODES.OK,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        message: "Unidades obtenidas correctamente.",
        data,
      },
    };
  }
}
