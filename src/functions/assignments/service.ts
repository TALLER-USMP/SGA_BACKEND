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
}

export const assignmentsService = new AssignmentsService();
