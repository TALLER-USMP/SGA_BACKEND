import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types"; // tu interfaz
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";
import { response } from "../../utils/response";
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

  //GET /api/syllabus/{id}/estrategias_metodologicas
  @route("/{id}/estrategias_metodologicas", "GET")
  async getEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);
    const result = await syllabusService.getEstrategiasMetodologicas(id);

    if (!result) {
      return response.notFound(`No se encontró el sílabo con id ${id}`);
    }

    return response.ok("Sílabo obtenido correctamente", result);
  }

  //GET /api/syllabus/{id}/recursos_didacticos_notas
  @route("/{id}/recursos_didacticos_notas", "GET")
  async getRecursosDidacticosNotas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);
    const result = await syllabusService.getRecursosDidacticosNotas(id);

    if (!result) {
      return response.notFound(`No se encontró el sílabo con id ${id}`);
    }

    return response.ok("Sílabo obtenido correctamente", result);
  }

  // GET /api/syllabus/{id}/evaluacion
  @route("/{id}/evaluacion", "GET")
  async getEvaluacion(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const result = await syllabusService.getEvaluacion(id);

    if (!result) {
      return response.notFound(`No se encontró la fórmula regla con id ${id}`);
    }

    return response.ok("Fórmula regla obtenida correctamente", result);
  }

  // PUT /api/syllabus/{id}/estrategias_metodologicas
  @route("/{id}/estrategias_metodologicas", "PUT")
  async putEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);
    const body = (await req.json()) as { estrategias_metodologicas: string };

    if (!id || !body.estrategias_metodologicas) {
      return response.badRequest(
        "Debe proporcionar un ID válido y el campo 'estrategias_metodologicas'.",
      );
    }

    const result = await syllabusService.putEstrategiasMetodologicas(
      id,
      body.estrategias_metodologicas,
    );

    if (!result) {
      return response.notFound(`No se encontró el sílabo con id ${id}`);
    }

    return response.ok(
      "Estrategia Metodológica actualizada correctamente",
      result,
    );
  }

  // PUT /api/syllabus/{id}/recursos_didacticos_notas
  @route("/{id}/recursos_didacticos_notas", "PUT")
  async putRecursosDidacticosNotas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);
    const body = (await req.json()) as { recursos_didacticos_notas: string };

    if (!id || !body.recursos_didacticos_notas) {
      return response.badRequest(
        "Debe proporcionar un ID válido y el campo 'recursos_didacticos_notas'.",
      );
    }

    const result = await syllabusService.putRecursosDidacticosNotas(
      id,
      body.recursos_didacticos_notas,
    );

    if (!result) {
      return response.notFound(`No se encontró el sílabo con id ${id}`);
    }

    return response.ok(
      "Recursos Didacticos Notas actualizada correctamente",
      result,
    );
  }

  // PUT /api/syllabus/{id}/evaluacion
  @route("/{id}/evaluacion", "PUT")
  async putFormulaEvaluacionRegla(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const idParam = req.params?.id;
      const id = Number(idParam);
      const body = (await req.json()) as {
        nombre_regla?: string;
        variable_final_codigo?: string;
        expresion_final?: string;
        descripcion?: string;
      };

      if (!id || Object.keys(body).length === 0) {
        return response.badRequest(
          "Debe proporcionar un ID válido y al menos un campo para actualizar.",
        );
      }

      const updated = await syllabusService.updateFormulaEvaluacionRegla(
        id,
        body,
      );

      if (!updated) {
        return response.notFound(`No se encontró la fórmula con id ${id}`);
      }

      return response.ok("Fórmula actualizada correctamente", updated);
    } catch (error) {
      console.error("Error en putFormulaEvaluacionRegla:", error);
      return response.serverError(
        "Error al actualizar la fórmula de evaluación",
      );
    }
  }

  // POST /api/syllabus/estrategias_metodologicas
  @route("/estrategias_metodologicas", "POST")
  async postEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = (await req.json()) as { estrategias_metodologicas: string };

    if (!body.estrategias_metodologicas) {
      return response.badRequest(
        "El campo 'estrategias_metodologicas' es requerido",
      );
    }

    const newSyllabus =
      await syllabusService.postEstrategiasMetodologicas(body);

    if (!newSyllabus) {
      return response.serverError("No se pudo crear el sílabo");
    }

    return response.created("Sílabo creado correctamente", newSyllabus);
  }

  // POST /api/syllabus/recursos_didacticos_notas
  @route("/recursos_didacticos_notas", "POST")
  async postRecursosDidacticosNotas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = (await req.json()) as { recursos_didacticos_notas: string };

    if (!body.recursos_didacticos_notas) {
      return response.badRequest(
        "El campo 'recursos_didacticos_notas' es requerido",
      );
    }

    const newSyllabus = await syllabusService.postRecursosDidacticosNotas(body);

    if (!newSyllabus) {
      return response.serverError("No se pudo crear el sílabo");
    }

    return response.created("Sílabo creado correctamente", newSyllabus);
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
}
