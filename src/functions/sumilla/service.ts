import { AppError } from "../../error";
import { sumillaRepository } from "./repository";
import { CreateSumillaSchema } from "./types";
import type { CreateSumilla } from "./types";

class SumillaService {
  async createSumilla(payload: unknown) {
    const data = CreateSumillaSchema.parse(payload);
    return await sumillaRepository.create(data);
  }
}

export const sumillaService = new SumillaService();
