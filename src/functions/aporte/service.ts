import { aporteRepository } from "./repository";
import { AporteCreateType } from "./types";

export const aporteService = {
  async createAporte(data: AporteCreateType) {
    return await aporteRepository.createAporte(data);
  },
};
