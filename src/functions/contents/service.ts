import { contentsRepository } from "./repository";
import { paramsSchema } from "./types";
import { AppError } from "../../error";

class ContentsService {
  /**
   * 📦 Lógica de negocio: validar y obtener unidades por curso
   */
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
}

export const contentsService = new ContentsService();
