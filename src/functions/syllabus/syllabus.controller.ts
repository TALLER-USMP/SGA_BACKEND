import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";

@controller("syllabus")
export class SyllabusController implements BaseController {
  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext,
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
