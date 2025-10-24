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
  @route("/{silaboDocenteId}/", "GET")
  async getPermissionsByDocente(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const level = _req.query.get("level") as "micro" | "macro";
    if (!level) {
      throw new AppError(
        "ERROR_PARAMETROS",
        "BAD_REQUEST",
        "Falta el parámetro level",
      );
    }
    const silaboDocenteId = Number(_req.params.silaboDocenteId);
    const data = await permissionsService.getPermissionsByLevel(
      level,
      silaboDocenteId,
    );
    return {
      status: STATUS_CODES.OK,
      jsonBody: data,
    };
  }

  @route("/", "GET")
  async getAssignaturesTeacher(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const items = await permissionsService.getAllSyllabusDocente();
    return {
      status: STATUS_CODES.OK,
      jsonBody: items,
    };
  }

  @route("/", "POST")
  async assignPermissions(
    _req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    return {
      status: 501,
      jsonBody: { ok: false, message: "Generic update() not implemented" },
    };
  }
}
