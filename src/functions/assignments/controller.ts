import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Readable } from "../../types";
import { SilaboService } from "./service";
import { SilaboListItem } from "./types";

@controller("assignments")
export class AssignmentsController implements Readable {
  /**
   * http://localhost:7071/api/assignments/?codigo=TEST101
   * http://localhost:7071/api/assignments/?nombre=Taller de Proyectos
   * Lista los sílabos filtrados por código o nombre (ambos opcionales).
   */
  @route("/", "GET")
  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const codigo =
        req.query.get("codigo")?.trim() || (await safeBodyParam(req, "codigo"));
      const nombre =
        req.query.get("nombre")?.trim() || (await safeBodyParam(req, "nombre"));

      const items: SilaboListItem[] = await SilaboService.list({
        codigo: codigo || undefined,
        nombre: nombre || undefined,
      });

      return {
        status: STATUS_CODES.OK,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          message: "Listado de sílabos obtenido correctamente.",
          data: items,
        },
      };
    } catch (err: any) {
      context.error("[AssignmentsController][list] Error:", err);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          message: "Error al obtener la lista de sílabos.",
          error: err?.message ?? String(err),
        },
      };
    }
  }

  async getOne(): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.NOT_IMPLEMENTED,
      jsonBody: { message: "Método getOne aún no implementado." },
    };
  }
}

async function safeBodyParam(
  req: HttpRequest,
  key: string,
): Promise<string | undefined> {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const value = body[key];
    if (typeof value === "string") return value;
    return undefined;
  } catch {
    return undefined;
  }
}
