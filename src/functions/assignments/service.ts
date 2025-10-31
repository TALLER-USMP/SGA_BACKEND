import { SilaboRepository } from "./repository";
import type { SilaboListItem, SilaboFilters } from "./types";
import { silaboFiltersSchema } from "./types";
import { AppError } from "../../error";

class AssignmentsService {
  async list(filters?: SilaboFilters): Promise<SilaboListItem[]> {
    // Validar filtros con Zod si se proporcionan
    if (filters) {
      const validation = silaboFiltersSchema.safeParse(filters);
      if (!validation.success) {
        throw new AppError(
          "ValidationError",
          "BAD_REQUEST",
          "Filtros inválidos proporcionados",
          validation.error.issues,
        );
      }
    }

    const items = await SilaboRepository.getAll(filters);

    return items;
  }

  async listByStatus(filters: {
    idDocente: string;
    estadoRevision: string;
  }): Promise<SilaboListItem[]> {
    const { idDocente, estadoRevision } = filters;

    if (!idDocente || !estadoRevision) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Faltan parámetros obligatorios: idDocente y estadoRevision",
      );
    }

    return SilaboRepository.getByStatus(idDocente, estadoRevision);
  }
}

export const assignmentsService = new AssignmentsService();
