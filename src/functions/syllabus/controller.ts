import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types";
import { controller, route } from "../../lib/decorators";
import { syllabusService } from "./service";
import { AppError } from "../../error";
import { isThrowStatement } from "typescript";

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

  @route("/{id}/datos-generales", "GET")
  async getGeneralData(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const id = Number(req.params.id);
    const result = await syllabusService.getGeneralDataSyllabusById(id);
    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result, null, 2),
    };
  }

  @route("/{id}/sumilla", "PUT")
  async putSumilla(
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
