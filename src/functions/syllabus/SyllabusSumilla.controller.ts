// src/functions/syllabus/sumilla.controller.ts
import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { BaseController } from "../../base-controller";
import { SilaboSumillaRepository } from "../../repositories/Sumilla.repository";

@controller("syllabus")
export class SyllabusSumillaController implements BaseController {
  private repository = new SilaboSumillaRepository();

  // Métodos requeridos por tu BaseController pero no usados aquí
  async list(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async getOne(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async create(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async delete(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  // Método obligatorio por la interfaz; delegamos a la acción real
  async update(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return this.updateSumilla(req, context);
  }

  /**
   * PUT /api/syllabus/{id}/sumilla
   * Body: { "sumilla": "texto..." }
   */
  @route("/{id}/sumilla", "PUT")
  async updateSumilla(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const { id } = req.params ?? {};
    const silaboId = Number(id);

    if (!Number.isFinite(silaboId)) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "id inválido" },
      };
    }

    let body: any;
    try {
      body = await req.json();
    } catch (error) {
      context.error("JSON inválido", error);
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "JSON inválido" },
      };
    }

    const sumilla: string = (body?.sumilla ?? "").toString().trim();
    if (!sumilla) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "La sumilla es obligatoria" },
      };
    }
    // Límite arbitrario razonable; ajusta si tu negocio lo requiere
    if (sumilla.length > 10000) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "La sumilla es demasiado larga" },
      };
    }

    try {
      const updated = await this.repository.updateSumillaBySilaboId(silaboId, sumilla);

      if (!updated) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          jsonBody: { message: "Sílabo no encontrado" },
        };
      }

      return {
        status: STATUS_CODES.OK,
        jsonBody: { message: "Sumilla actualizada", silabo: updated },
      };
    } catch (error: any) {
      context.error("Error al actualizar sumilla", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { message: "Error en el servidor" },
      };
    }
  }
}
