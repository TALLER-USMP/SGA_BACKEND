import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { auth, route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { SyllabusService } from "../../service/syllabus.service";

@controller("syllabus")
export class SyllabusController implements BaseController {
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
    throw new Error("Method not implemented.");
  }

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
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
}
