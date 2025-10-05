import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { T56Repository } from "../../repositories/t104.repository";

interface UpdateEstrategiasMetodologicasI {
  estrategiasMetodologicas: string;
}

@controller("syllabus")
export class SyllabusController implements BaseController {
  private t6 = new T56Repository();

  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        message: "acceso permitido",
      },
    };
  }

  @route("/{id}")
  async getOne(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  //PUT /api/syllabus/{id}/estrategias-metodologicas

  @route("/{id}/estrategias-metodologicas", "PUT")
  async updateEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    try {
      const id = Number(req.params?.id);

      if (!id) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "ID inválido" },
        };
      }

      const body = (await req.json()) as UpdateEstrategiasMetodologicasI;

      if (!body.estrategiasMetodologicas) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "El campo estrategiasMetodologicas es requerido" },
        };
      }

      // Llamar al repositorio para actualizar
      const updated = await this.t6.updateEstrategiasMetodologicas(
        id,
        body.estrategiasMetodologicas
      );

      if (!updated) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          jsonBody: { error: "Silabo no encontrado" },
        };
      }

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: "Estrategias Metodológicas actualizadas correctamente",
          data: updated,
        },
      };
    } catch (error: any) {
      context.error("Error al actualizar Estrategias Metodológicas:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { error: "Error interno del servidor" },
      };
    }
  }

  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "DELETE")
  async delete(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
