import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { sumillaService } from "./service";
import { AppError } from "../../error";

@controller("sumilla")
export class SumillaController {
  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    try {
      const payload = await req.json();
      console.log(payload);
      const createdSumilla = await sumillaService.createSumilla(payload);
      return {
        status: STATUS_CODES.CREATED,
        jsonBody: {
          message: "Sumilla creada exitosamente",
          data: createdSumilla,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "ServerError",
        "INTERNAL_SERVER_ERROR",
        "Error al procesar la solicitud de creación de sumilla",
        error,
      );
    }
  }
}
