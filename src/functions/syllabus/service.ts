import { syllabusRepository } from "./repostory";
import { SyllabusCreateSchema } from "./types";
import { SumillaSchema } from "./types";
import { AppError } from "../../error";
import { ZodError } from "zod";

class SyllabusService {
  private repository = syllabusRepository;

  async findSyllabusAndUpdate(id: number) {
    console.log(id);
  }

  async getGeneralDataSyllabusById(id: number) {
    const data = await syllabusRepository.findGeneralDataById(id);
    if (!data) throw new AppError("Sílabo no encontrado", "NOT_FOUND");
    return data;
  }

  async registerSumilla(idSyllabus: number, payload: unknown) {
    let sumilla;
    // ✅ Validar con Zod
    const parsed = SumillaSchema.parse(payload);
    sumilla = parsed.sumilla;
    if (!sumilla) {
      throw new AppError(
        "ValidationError",
        "BAD_REQUEST",
        "Datos inválidos: " + "Error en la sumilla",
      );
    }

    // ✅ Actualizar en la BD
    await this.repository.updateSumilla(idSyllabus, sumilla);

    return { message: "Sumilla registrada correctamente" };
  }
}

export const syllabusService = new SyllabusService();
