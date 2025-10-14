import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types";
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";

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
}
