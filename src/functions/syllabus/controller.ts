import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types";
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";
import { response } from "../../utils/response";

@controller("syllabus")
export class SyllabusController implements Updatable {
  // PUT http://localhost:2999/apu/syllabus/
  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext,
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

  //GET /api/syllabus/{id}/recursos_didacticos
  @route("/{id}/recursos_didacticos", "GET")
  async getRecursosDidacticos(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);
    const result = await syllabusService.getRecursosDidacticos(id);

    if (!result) {
      return response.notFound(`No se encontró el sílabo con id ${id}`);
    }

    return response.ok("Sílabo obtenido correctamente", result);
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

  // POST /api/syllabus/recursos_didacticos
  @route("/recursos_didacticos", "POST")
  async postRecursosDidacticos(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const body = (await req.json()) as { recursos_didacticos: string };

    if (!body.recursos_didacticos) {
      return response.badRequest("El campo 'recursos_didacticos' es requerido");
    }

    const newSyllabus = await syllabusService.postRecursosDidacticos(body);

    if (!newSyllabus) {
      return response.serverError("No se pudo crear el sílabo");
    }

    return response.created("Sílabo creado correctamente", newSyllabus);
  }
}
