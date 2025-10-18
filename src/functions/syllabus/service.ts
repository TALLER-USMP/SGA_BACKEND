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
    try {
      const parsed = SumillaSchema.parse(payload);
      sumilla = parsed.sumilla;
    } catch (err) {
      // Si la validación falla con Zod, convertir a AppError con mensaje específico
      if (err instanceof ZodError) {
        // Usar un mensaje fijo para que el campo `message` sea claro
        // y pasar `err.issues` en `details` para conservar la información estructurada
        throw new AppError(
          "Validacion fallida",
          "BAD_REQUEST",
          "La sumilla es obligatoria y debe tener al menos 80 palabras",
          err.issues,
        );
      }
      throw err;
    }

    // ✅ Actualizar en la BD
    await this.repository.updateSumilla(idSyllabus, sumilla);

    return { message: "Sumilla registrada correctamente" };
  }
}

export const syllabusService = new SyllabusService();
