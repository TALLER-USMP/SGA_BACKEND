import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { DocenteRepository } from "../../repositories/teacher.repository";

function getPathParam(
  req: HttpRequest,
  context: InvocationContext,
  key: string,
) {
  // @ts-ignore
  const fromReq = req.params && (req.params[key] ?? req.params.get?.(key));
  const fromBinding = (context as any).bindingData?.[key];
  return fromReq ?? fromBinding;
}

@controller("docente")
export class DocenteController implements BaseController {
  private repo: DocenteRepository;

  constructor() {
    this.repo = new DocenteRepository();
  }

  // Lista todas las asignaturas
  @route("/asignaturas/all")
  async listAllAsignaturas(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const asignaturas = await this.repo.findAsignaturas();
      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          data: asignaturas,
          meta: { count: asignaturas.length },
        },
      };
    } catch (err: any) {
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          error: "No se pudieron obtener las asignaturas",
          details:
            process.env.NODE_ENV === "development"
              ? String(err?.message ?? err)
              : undefined,
        },
      };
    }
  }

  // GET /api/docente/{id}/asignaturas por docente
  @route("/{id}/asignaturas")
  async listAsignaturas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const idParam = getPathParam(req, context, "id");
      const docenteId = Number(idParam);

      if (!idParam || Number.isNaN(docenteId)) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "id inválido" },
        };
      }

      const asignaturas = await this.repo.findAsignaturasByDocenteId(docenteId);

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          data: asignaturas,
          meta: { docenteId, count: asignaturas.length },
        },
      };
    } catch (err: any) {
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          error: "No se pudieron obtener las asignaturas",
          details:
            process.env.NODE_ENV === "development"
              ? String(err?.message ?? err)
              : undefined,
        },
      };
    }
  }

  @route("/")
  async list(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  @route("/{id}")
  async getOne(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  @route("/", "POST")
  async create(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  @route("/", "PUT")
  async update(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  @route("/", "DELETE")
  async delete(
    _req: HttpRequest,
    _context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
