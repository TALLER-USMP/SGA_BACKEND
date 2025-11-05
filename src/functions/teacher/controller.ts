import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Readable, Updatable } from "../../types";
import { controller, route } from "../../lib/decorators";
import { teacherService } from "./service";
import { AppError } from "../../error";
import { STATUS_CODES } from "../../status-codes";

@controller("docente")
export class TeacherController implements Readable, Updatable {
  /** GET /api/docente/{docenteId} */
  @route("/{docenteId}", "GET")
  async getOne(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { docenteId } = (req.params ?? {}) as { docenteId?: string };
    const id = Number(docenteId);

    if (!Number.isFinite(id) || id <= 0) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "Debe especificar un docenteId válido en la ruta.",
      );
    }

    const data = await teacherService.getProfile(id);
    return { status: STATUS_CODES.OK, jsonBody: { success: true, data } };
  }

  /** PUT /api/docente/{docenteId} */
  @route("/{docenteId}", "PUT")
  async update(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { docenteId } = (req.params ?? {}) as { docenteId?: string };
    const id = Number(docenteId);

    if (!Number.isFinite(id) || id <= 0) {
      throw new AppError(
        "BadRequest",
        "BAD_REQUEST",
        "Debe especificar un docenteId válido en la ruta.",
      );
    }

    const body = await req.json();
    const data = await teacherService.updateProfile(id, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Perfil actualizado correctamente",
        data,
      },
    };
  }
}
