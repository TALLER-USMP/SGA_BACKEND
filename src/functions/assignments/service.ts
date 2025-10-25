import { SilaboRepository } from "./repository";
import type { SilaboListItem, SilaboFilters } from "./types";

export const SilaboService = {
  async list(filters?: SilaboFilters): Promise<SilaboListItem[]> {
    return SilaboRepository.getAll(filters);
  },
};
