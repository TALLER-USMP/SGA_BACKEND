import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Readable } from "../../types";
import { contentsService } from "./service";
import type { CreateUnidadInput } from "./types";

@controller("programacion-contenidos")
export class ContentsController implements Readable {
  // =====================================================
  //  RUTA GET: Obtener unidades por código de curso
  // =====================================================
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

  // =====================================================
  // RUTA POST: Crear nueva unidad de contenido
  // =====================================================
  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = (await req.json()) as CreateUnidadInput;
    const data = await contentsService.create(body);

    return {
      status: STATUS_CODES.CREATED,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        message: "Unidad registrada correctamente.",
        data,
      },
    };
  }

  // =====================================================
  // RUTA PUT: Actualizar una unidad existente
  // =====================================================
  @route("/{id:int}", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const body = (await req.json()) as Partial<CreateUnidadInput>;

    const data = await contentsService.update(id, body);

    return {
      status: STATUS_CODES.OK,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        message: "Unidad actualizada correctamente.",
        data,
      },
    };
  }
}
