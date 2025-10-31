import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";
import { AppError } from "../../error";
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

  //ruta sumilla
  @route("/{id}/sumilla", "PUT")
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
}
