import { syllabusRepository } from "./repostory";

class SyllabusService {
  async getEstrategiasMetodologicas(id: number) {
    try {
      const syllabus = await syllabusRepository.getEstrategiasMetodologicas(id);

      if (!syllabus) {
        return { status: 404, data: { message: "Sílabo no encontrado" } };
      }

      return {
        status: 200,
        data: { estrategias_metodologicas: syllabus.estrategias_metodologicas },
      };
    } catch (error) {
      return { status: 500, data: { message: "Error al obtener estrategias" } };
    }
  }

  async postEstrategiasMetodologicas(body: {
    estrategias_metodologicas: string;
  }) {
    const { estrategias_metodologicas } = body;
    return syllabusRepository.postEstrategiasMetodologicas(
      estrategias_metodologicas,
    );
  }
}

export const syllabusService = new SyllabusService();
