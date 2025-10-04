import { SyllabusRepository } from "../repositories/syllabus.repository";

export class SyllabusService {
  private syllabusRepo = new SyllabusRepository();

  async getOne(id: string) {
    const syllabus = await this.syllabusRepo.findById(id);
    if (!syllabus) {
      throw new Error("Silabo no encontrado");
    }

    return syllabus;
  }

  async updateCompetencias(id: number, data: any[]) {
    if (!data || data.length === 0) {
      throw new Error("No se proporcionaron competencias para actualizar");
    }

    return await this.syllabusRepo.updateCompetencies(id, data);
  }
}
