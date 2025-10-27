import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { permissionsService } from "./service";
import { AppError } from "../../error";
import { STATUS_CODES } from "../../status-codes";
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
  @route("/{docenteId}/", "GET")
  async getPermissionsByDocente(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const docenteId = Number(_req.params.docenteId);
    if (!docenteId) {
      throw new AppError(
        "ERROR_PARAMETROS",
        "BAD_REQUEST",
        "Falta el parámetro level",
      );
    }
    const data = await permissionsService.getPermissionsByDocenteId(docenteId);
    return {
      status: STATUS_CODES.OK,
      jsonBody: data,
    };
  }

  @route("/", "POST")
  async assignPermissions(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = await _req.json();
    await permissionsService.assignPermissions(body);
    return {
      status: STATUS_CODES.OK,
      jsonBody: { message: "Permisos asignados correctamente" },
    };
  }
}
