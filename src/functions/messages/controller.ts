import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { AppError } from "../../error";
import { STATUS_CODES } from "../../status-codes";
import { messagesService } from "./service";
//1
@controller("permisos")
export class PermissionsController implements Updatable {
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

  @route("/enviar", "POST")
  async assignPermissions(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = await _req.json();
    await messagesService.sendMessage(body);
    return {
      status: STATUS_CODES.OK,
      jsonBody: { message: "Permisos asignados correctamente" },
    };
  }
}
