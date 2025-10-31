import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { AppError } from "../../error";
import { STATUS_CODES } from "../../status-codes";
import { revisionService } from "./service";
//1
@controller("revision")
export class RevisionController implements Updatable {
  // Requisito de la interfaz Updatable
  @route("/", "PUT")
  async update(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    return {
      status: 501,
      jsonBody: { ok: false, message: "Generic update() not implemented" },
    };
  }
  @route("/", "GET")
  async getCourseAndState(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const result = await revisionService.getAllCoursesAndState();
    return {
      status: STATUS_CODES.OK,
      jsonBody: { ok: true, result },
    };
  }
}
