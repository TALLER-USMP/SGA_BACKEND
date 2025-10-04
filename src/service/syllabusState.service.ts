import { SyllabusStateRepository } from "../repositories/syllabusState.repository";

export class SyllabusStateService {
  private syllabusRepo = new SyllabusStateRepository();

  async getState(id: string) {
    const syllableState = await this.syllabusRepo.findById(id);

    if (!syllableState) {
      throw new Error("State for syllable not found");
    }

    return syllableState;
  }
}
