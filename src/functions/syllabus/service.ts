import { syllabusRepository } from "./repostory";

class SyllabusService {
  async getEstrategiasMetodologicas(id: number) {
    return await syllabusRepository.getEstrategiasMetodologicas(id);
  }

  async getRecursosDidacticos(id: number) {
    return await syllabusRepository.getRecursosDidacticos(id);
  }

  async postEstrategiasMetodologicas(body: {
    estrategias_metodologicas: string;
  }) {
    const { estrategias_metodologicas } = body;
    return syllabusRepository.postEstrategiasMetodologicas(
      estrategias_metodologicas,
    );
  }

  async postRecursosDidacticos(body: { recursos_didacticos: string }) {
    const { recursos_didacticos } = body;
    return syllabusRepository.postRecursosDidacticos(recursos_didacticos);
  }
}

export const syllabusService = new SyllabusService();
