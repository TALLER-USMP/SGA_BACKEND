import { contributionRepository } from "./repository";
import { ContributionCreateType } from "./types";

export const contributionService = {
  async createAporte(data: ContributionCreateType) {
    return await contributionRepository.createContribution(data);
  },
};
