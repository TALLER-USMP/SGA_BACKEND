import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { SilaboEvaluacionRepository } from "../../repositories/silaboEvaluacion.repository";
import { silaboEvaluacion } from "../../../drizzle/schema";
import { BaseController } from "../../base-controller";

@controller("syllabus")
export class SyllabusEvaluationController implements BaseController {
  private repository = new SilaboEvaluacionRepository();

  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  // Método obligatorio, sin decorador
  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    // Delegamos a updateEvaluation si quieres
    return this.updateEvaluation(req, context);
  }

  // Método real que maneja la ruta PUT
  @route("/{id}/evaluacion", "PUT")
  async updateEvaluation(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { id } = req.params;
    let body: Partial<typeof silaboEvaluacion>;

    try {
      body = (await req.json()) as Partial<typeof silaboEvaluacion>;
    } catch (error) {
      context.error("Error parseando JSON", error);
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "JSON inválido" },
      };
    }

    try {
      const updated = await this.repository.updateBySilaboId(Number(id), body);

      if (!updated) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          jsonBody: { message: "Evaluación no encontrada" },
        };
      }

      return {
        status: STATUS_CODES.OK,
        jsonBody: { message: "Evaluación actualizada", evaluacion: updated },
      };
    } catch (error: any) {
      context.error("Error al actualizar evaluación", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { message: "Error en el servidor" },
      };
    }
  }
}
