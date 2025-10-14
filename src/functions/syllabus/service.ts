import { syllabusRepository } from "./repostory";
import { SyllabusCreateSchema } from "./types";
import { SumillaSchema } from "./types";

class SyllabusService {
  private repository = syllabusRepository;

  async findSyllabusAndUpdate(id: number) {
    console.log(id);
  }

  async createSyllabus(payload: unknown) {
    // Validación con Zod
    const data = SyllabusCreateSchema.parse(payload);

    // (Opcional) reglas de negocio antes del insert
    // Ej: validar que el código no esté repetido
    // const existing = await this.repository.findByCodigo(data.codigoAsignatura);
    // if (existing) throw new Error("El sílabo ya existe para este código de asignatura.");

    const idNewSyllabus = await this.repository.create(data);
    return idNewSyllabus;
  }

  async registerSumilla(idSyllabus: number, payload: unknown) {
    // ✅ Validar con Zod
    const { sumilla } = SumillaSchema.parse(payload);

    // ✅ Actualizar en la BD
    await this.repository.updateSumilla(idSyllabus, sumilla);

    return { message: "Sumilla registrada correctamente" };
  }
}

export const syllabusService = new SyllabusService();
