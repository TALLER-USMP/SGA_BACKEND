import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";
import { AppError } from "../../error";
import { ContributionCreateSchema } from "./types";
import { isThrowStatement } from "typescript";
import { STATUS_CODES } from "../../status-codes";

//1
@controller("syllabus")
export class SyllabusController implements Updatable {
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

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const service = syllabusService;
    const body = await req.json();
    const idNewSyllabus = await service.createSyllabus(body);
    if (!idNewSyllabus) {
      return {
        status: 500,
      };
    }
    return {
      status: 201,
      jsonBody: {
        success: true,
        message: "Sí­labo creado correctamente",
        id: idNewSyllabus,
      },
    };
  }

  @route("/{id}/sumilla", "POST")
  async registerSumilla(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const service = syllabusService;
    const id = Number(req.params.id);
    const body = await req.json();
    const result = await service.registerSumilla(id, body);
    return {
      status: 200,
      jsonBody: {
        success: true,
        message: result.message,
      },
    };
  }

  @route("/{id}/sumilla", "PUT")
  async updateSumilla(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const service = syllabusService;
    const id = Number(req.params.id);
    const body = await req.json();
    const result = await service.updateSumilla(id, body);
    return {
      status: 200,
      jsonBody: {
        success: true,
        message: result.message,
      },
    };
  }

  @route("/{silaboId}/sumilla", "GET")
  async getSumillaBySilaboId(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.silaboId);
    const result = await syllabusService.getSumillaBySilaboId(id);
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,

        content: result,
      },
    };
  }

  // --------- COMPETENCIAS ----------
  // GET /api/syllabus/:syllabusId/competencies
  @route("/{syllabusId}/competencies", "GET")
  async listCompetencies(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const items = await syllabusService.getCompetencies(syllabusId);
    return { status: 200, jsonBody: { items } };
  }
  // POST /api/syllabus/:syllabusId/competencies
  // body: { items: [{ text, order? }, ...] }
  @route("/{syllabusId}/competencies", "POST")
  async createCompetencies(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const body = await req.json(); // { items: [...] }
    const res = await syllabusService.createCompetencies(syllabusId, body);
    return { status: 201, jsonBody: res };
  }

  // DELETE /api/syllabus/:syllabusId/competencies/:id
  @route("/{syllabusId}/competencies/{id}", "DELETE")
  async deleteCompetency(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId, id } = req.params as { syllabusId: string; id: string };
    const res = await syllabusService.removeCompetency(syllabusId, id);
    return { status: 200, jsonBody: res };
  }
  // ---------- COMPONENTES ----------
  // GET /api/syllabus/:syllabusId/components
  @route("/{syllabusId}/components", "GET")
  async listComponents(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("not implemented");
  }

  @route("/{syllabusId}/datos-generales", "GET")
  async getGeneralData(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const id = Number(syllabusId);
    if (Number.isNaN(id)) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { name: "BadRequest", message: "syllabusId inválido" },
      };
    }
    const data = await syllabusService.getGeneralDataSyllabusById(id);
    return { status: STATUS_CODES.OK, jsonBody: data };
  }

  // POST /api/syllabus/:syllabusId/components
  // body: { items: [{ text, order? }, ...] }
  @route("/{syllabusId}/components", "POST")
  async createComponents(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const result = await syllabusService.getGeneralDataSyllabusById(id);
    return {
      status: STATUS_CODES.OK,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result, null, 2),
    };
  }

  // DELETE /api/syllabus/:syllabusId/components/:id
  @route("/{syllabusId}/components/{id}", "DELETE")
  async deleteComponent(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId, id } = req.params as { syllabusId: string; id: string };
    const res = await syllabusService.removeComponent(syllabusId, id);
    return { status: 200, jsonBody: res };
  }

  // ====== ATTITUDES ======
  // GET /api/syllabus/:syllabusId/attitudes
  @route("/{syllabusId}/attitudes", "GET")
  async listAttitudes(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const items = await syllabusService.getAttitudes(syllabusId);
    return { status: 200, jsonBody: { items } };
  }

  // POST /api/syllabus/:syllabusId/attitudes
  // body: { items: [{ text, order? }, ...] }
  @route("/{syllabusId}/attitudes", "POST")
  async createAttitudes(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const body = await req.json();
    const res = await syllabusService.createAttitudes(syllabusId, body);
    return { status: 201, jsonBody: res };
  }

  // DELETE /api/syllabus/:syllabusId/attitudes/:id
  @route("/{syllabusId}/attitudes/{id}", "DELETE")
  async deleteAttitude(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId, id } = req.params as { syllabusId: string; id: string };
    const res = await syllabusService.removeAttitude(syllabusId, id);
    return { status: 200, jsonBody: res };
  }

  @route("/{syllabusId}/contribution", "POST")
  async createContribution(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { syllabusId } = req.params as { syllabusId: string };
    const body = (await req.json()) as Record<string, unknown>;

    // Validación con Zod
    const parsed = ContributionCreateSchema.safeParse({
      ...(body || {}),
      syllabusId: Number(syllabusId), // 👈 conversión correcta aquí
    });

    if (!parsed.success) {
      return {
        status: 400,
        jsonBody: {
          message: "Datos inválidos en el cuerpo de la solicitud",
          errors: parsed.error.issues,
        },
      };
    }

    const aporteData = parsed.data;
    const result = await syllabusService.createAporte(aporteData);

    return {
      status: 201,
      jsonBody: {
        message: "Aporte registrado correctamente",
        result,
      },
    };
  }

  @route("/{syllabusId}/state", "PUT")
  async updateState(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "ID inválido");
    }

    const body = await req.json();
    const result = await syllabusService.updateRevisionStatus(id, body);

    return { status: 200, jsonBody: result };
  }

  @route("/{id}/complete", "GET")
  async getCompleteSyllabus(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    if (typeof id !== "number" || Number.isNaN(id) || !Number.isFinite(id)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "ID de sílabo inválido");
    }

    const result = await syllabusService.getCompleteSyllabus(id);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Sílabo completo obtenido correctamente",
        data: result,
      },
    };
  }

  // ====== REVISION ======
  // GET /api/syllabus/revision
  @route("/revision", "GET")
  async getSyllabusInRevision(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const estado = req.query.get("estado") || undefined;
    const docenteIdStr = req.query.get("docenteId");
    const docenteId = docenteIdStr ? Number(docenteIdStr) : undefined;

    const result = await syllabusService.getAllCoursesInRevision(
      estado,
      docenteId,
    );

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Lista de sílabos en revisión obtenida correctamente",
        data: result,
        total: result.length,
      },
    };
  }

  // GET /api/syllabus/revision/{id}
  @route("/revision/{id}", "GET")
  async getSyllabusRevisionById(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const result = await syllabusService.getSyllabusRevisionById(id);
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Sílabo obtenido correctamente",
        data: result,
      },
    };
  }

  // POST /api/syllabus/{id}/aprobar
  @route("/{id}/aprobar", "POST")
  async approveSyllabus(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const body = await req.json();

    const result = await syllabusService.approveSyllabus(id, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Sílabo aprobado correctamente",
        data: result,
      },
    };
  }

  // POST /api/syllabus/{id}/desaprobar
  @route("/{id}/desaprobar", "POST")
  async disapproveSyllabus(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const body = await req.json();

    const result = await syllabusService.disapproveSyllabus(id, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Sílabo desaprobado correctamente",
        data: result,
      },
    };
  }

  // GET /api/syllabus/{id}/revision
  @route("/{id}/revision", "GET")
  async getRevisionData(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);

    const result = await syllabusService.getRevisionData(id);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Datos de revisión obtenidos correctamente",
        data: result,
      },
    };
  }

  // POST /api/syllabus/{id}/revision
  @route("/{id}/revision", "POST")
  async saveRevisionData(
    req: HttpRequest,
    _ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const body = await req.json();

    const result = await syllabusService.saveRevisionData(id, body);

    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        success: true,
        message: "Datos de revisión guardados correctamente",
        data: result,
      },
    };
  }
}
