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
}

/* ===========================================================
   EXPORTAR INSTANCIA
   =========================================================== */
export const contentsService = new ContentsService();
