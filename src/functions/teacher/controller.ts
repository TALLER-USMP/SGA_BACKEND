import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { AppError } from "../../error";
import { controller, route, requireRole } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { Listable, Readable, Updatable } from "../../types";
import { teacherService } from "./service";

@controller("docente")
export class TeacherController implements Listable, Readable, Updatable {
  /** GET /api/docente - Lista todos los profesores (requiere rol de administrador o coordinador) */
  @route("/", "GET")
  @requireRole("ADMIN", "COORDINADOR")
  async list(req: HttpRequest): Promise<HttpResponseInit> {
    const data = await teacherService.listTeachers();
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Lista de profesores obtenida correctamente",
        data: data.items,
        total: data.total,
      },
    };
  }

  /** GET /api/docente/{docenteId} */
  @route("/{docenteId}", "GET")
  async getOne(req: HttpRequest): Promise<HttpResponseInit> {
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
  async update(req: HttpRequest): Promise<HttpResponseInit> {
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
