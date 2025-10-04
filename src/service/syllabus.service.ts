import { SyllabusRepository } from "../repositories/syllabus.repository";

export class SyllabusService {
  private syllabusRepo = new SyllabusRepository();

  async getOne(id: string) {
    const syllabus = await this.syllabusRepo.findById(id);
    if (!syllabus) {
      throw new Error("Usuario no encontrado");
    }

    return syllabus;
  }
}
