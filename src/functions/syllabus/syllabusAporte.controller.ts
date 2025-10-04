// src/controllers/syllabusAporte.controller.ts
import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { SilaboAporteResultadoProgramaRepository } from "../../repositories/silaboAporteResultadoPrograma.repository";
import { BaseController } from "../../base-controller";

@controller("silabo")
export class SyllabusAporteController implements BaseController {
  private repository = new SilaboAporteResultadoProgramaRepository();

  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    return this.updateAporte(req, context);
  }

  // PUT /api/silabo/{id}/aporte-curso
  @route("/{id}/aporte-curso", "PUT")
  async updateAporte(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const { id } = req.params;

    let body: {
      resultadoProgramaCodigo: string;
      resultadoProgramaDescripcion?: string;
      aporteValor?: "K" | "R" | "" | null;
    };

    try {
      body = (await req.json()) as {
        resultadoProgramaCodigo: string;
        resultadoProgramaDescripcion?: string;
        aporteValor?: "K" | "R" | "" | null;
      };
    } catch (error) {
      context.error("Error parseando JSON", error);
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: { message: "JSON inválido" },
      };
    }

    // ✅ Normalizar "" a null
    const aporteValorNormalizado =
      body.aporteValor === "" ? null : body.aporteValor;

    // ✅ Validación
    if (
      aporteValorNormalizado !== null &&
      aporteValorNormalizado !== undefined &&
      aporteValorNormalizado !== "K" &&
      aporteValorNormalizado !== "R"
    ) {
      return {
        status: STATUS_CODES.BAD_REQUEST,
        jsonBody: {
          message: "El campo aporteValor solo puede ser 'K', 'R' o vacío",
        },
      };
    }

    try {
      const updated = await this.repository.updateBySilaboIdAndCodigo(
        Number(id),
        body.resultadoProgramaCodigo,
        {
          resultadoProgramaDescripcion: body.resultadoProgramaDescripcion,
          aporteValor: aporteValorNormalizado, // 👈 ya es "K", "R" o null
        },
      );

      if (!updated) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          jsonBody: {
            message: "Aporte no encontrado para el silabo y código indicados",
          },
        };
      }

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: "Aporte actualizado correctamente",
          aporte: updated,
        },
      };
    } catch (error: any) {
      context.error("Error al actualizar aporte", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: { message: "Error en el servidor" },
      };
    }
  }
}
