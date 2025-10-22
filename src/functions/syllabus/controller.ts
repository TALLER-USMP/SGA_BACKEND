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

  //GET /api/syllabus/{id}/estrategias_metodologicas
  @route("/{id}/estrategias_metodologicas", "GET")
  async getEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const idParam = req.params?.id;
    const id = Number(idParam);

    if (isNaN(id)) {
      return { status: 400, body: "El parámetro ID debe ser un número" };
    }

    const result = await syllabusService.getEstrategiasMetodologicas(id);

    return {
      status: result.status,
      jsonBody: result.data,
    };
  }

  //POST /api/syllabus
  // POST /api/syllabus
  @route("", "POST")
  async postEstrategiasMetodologicas(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    // Convertimos el body a JSON tipado
    const body = (await req.json()) as {
      estrategias_metodologicas: string;
    };

    // Llamamos al service
    const newSyllabus =
      await syllabusService.postEstrategiasMetodologicas(body);

    // Si no se creó, devolvemos error
    if (!newSyllabus) {
      return {
        status: 500,
        jsonBody: { success: false, message: "No se pudo crear el sílabo" },
      };
    }

    // Respuesta exitosa
    return {
      status: 201,
      jsonBody: {
        success: true,
        message: "Sílabo creado correctamente",
        data: newSyllabus,
      },
    };
  }
}
