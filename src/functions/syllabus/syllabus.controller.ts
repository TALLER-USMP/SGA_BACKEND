import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { SyllabusService } from "../../service/syllabus.service";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { SilaboRepository } from "../../repositories/silabo.repository";
import { SilaboFuenteRepository } from "../../repositories/silaboFuente.repository";

interface UpdateRecursosDidacticosDto {
  recursosDidacticos: string;
}

@controller("syllabus")
export class SyllabusController implements BaseController {
  private repo = new SilaboRepository();
  private repoFuente = new SilaboFuenteRepository();
  private syllabusService = new SyllabusService();

  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const nombre = req.query.get("nombre") || undefined;
    const ciclo = req.query.get("ciclo") || undefined;
    const estado = req.query.get("estado") || undefined;
    try {
      const data = await this.syllabusService.searchSyllabus({
        nombre,
        ciclo,
        estado,
      });

      return {
        status: STATUS_CODES.OK,
        jsonBody: data,
      };
    } catch (e) {
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          message: "INTERNAL_SERVER_ERROR",
        },
      };
    }
  }

  @route("/{id}")
  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    // try {
    const id = req.params.id;
    const response = await this.syllabusService.getOne(id);
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        response,
      },
    };
    // } catch (e) {
    //   return {
    //     status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    //     jsonBody: {
    //       code: "INTERAL_SERVER_ERROR",
    //       message: "Un error desconocido ha ocurrido",
    //     },
    //   };
    // }
  }

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  //PUT /api/syllabus/{id}/recursos-didacticos

  @route("/{id}/recursos-didacticos", "PUT")
  async updateRecursosDidacticos(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const id = Number(req.params?.id);

      if (!id) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "ID inválido" },
        };
      }

      const body = (await req.json()) as UpdateRecursosDidacticosDto;

      if (!body.recursosDidacticos) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "El campo recursosDidacticos es requerido" },
        };
      }

      // Llamar al repositorio para actualizar
      const updated = await this.repo.updateRecursosDidacticos(
        id,
        body.recursosDidacticos,
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
          message: "Recursos didácticos actualizados correctamente",
          data: updated,
        },
      };
    } catch (error: any) {
      context.error("Error al actualizar recursos didácticos:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { error: "Error interno del servidor" },
      };
    }
  }

  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "DELETE")
  async delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  // PUT /api/syllabus/{id}/fuentes-consulta

  @route("/{id}/fuentes-consulta", "PUT")
  async updateFuente(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const id = Number(req.params?.id);

      if (isNaN(id) || id <= 0) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "ID inválido" },
        };
      }

      const body = await req.json();

      if (!body || Object.keys(body).length === 0) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "Debe enviar al menos un campo para actualizar" },
        };
      }

      const updated = await this.repoFuente.updateFuente(id, body);

      if (!updated) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          jsonBody: { error: "Fuente de consulta no encontrada" },
        };
      }

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: "Fuente de consulta actualizada correctamente",
          data: updated,
        },
      };
    } catch (error: any) {
      context.error("Error al actualizar fuente de consulta:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { error: "Error interno del servidor" },
      };
    }
  }
}
