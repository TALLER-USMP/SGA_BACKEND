import { contentsRepository } from "./repository";
import {
  paramsSchema,
  createUnidadSchema,
  type CreateUnidadInput,
} from "./types";
import { AppError } from "../../error";

/* ===========================================================
   SERVICE: PROGRAMACIÓN DE CONTENIDOS
   =========================================================== */
class ContentsService {
  /* -----------------------------------------------------------
     LISTAR UNIDADES POR CURSO (GET /:cursoCodigo)
     ----------------------------------------------------------- */
  async list(cursoCodigoParam: string) {
    const validation = paramsSchema.safeParse({
      cursoCodigo: cursoCodigoParam,
    });

    if (!validation.success) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Código de curso inválido",
        validation.error.issues,
      );
    }

    const { cursoCodigo } = validation.data;
    const items =
      await contentsRepository.getUnidadesByCursoCodigo(cursoCodigo);

    return items;
  }

  /* -----------------------------------------------------------
      CREAR UNA NUEVA UNIDAD (POST /api/programacion-contenidos)
     ----------------------------------------------------------- */
  async create(data: CreateUnidadInput) {
    const validation = createUnidadSchema.safeParse(data);

    if (!validation.success) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Datos inválidos para crear la unidad",
        validation.error.issues,
      );
    }

    const unidad = await contentsRepository.createUnidad(validation.data);
    return unidad;
  }

  /* -----------------------------------------------------------
      ACTUALIZAR UNA UNIDAD EXISTENTE (PUT /api/programacion-contenidos/:id)
     ----------------------------------------------------------- */
  async update(id: number, data: Partial<CreateUnidadInput>) {
    // Validar que el ID sea válido
    if (!id || isNaN(id)) {
      throw new AppError("ValidationError", "BAD_REQUEST", "ID inválido");
    }

    // Validar que haya campos para actualizar
    if (!data || Object.keys(data).length === 0) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "No se enviaron campos para actualizar",
      );
    }

    // Validar datos parcialmente con zod
    const validation = createUnidadSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Datos inválidos para actualizar la unidad",
        validation.error.issues,
      );
    }

    // Ejecutar actualización
    const updatedUnidad = await contentsRepository.updateUnidad(
      id,
      validation.data,
    );

    if (!updatedUnidad) {
      throw new AppError("NotFoundError", "NOT_FOUND", "Unidad no encontrada");
    }

    return {
      message: "Unidad actualizada correctamente.",
      data: updatedUnidad,
    };
  }
}

/* ===========================================================
   EXPORTAR INSTANCIA
   =========================================================== */
export const contentsService = new ContentsService();
