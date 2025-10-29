import { syllabusRepository } from "./repository";
import {
  UpsertCompetenciesSchema,
  CreateComponentsSchema, //
  CreateAttitudesSchema, //
} from "./types";
import { SyllabusCreateSchema } from "./types";
import { SumillaSchema } from "./types";
import { AppError } from "../../error";
import { ZodError } from "zod";

export class SyllabusService {
  // ---------- COMPETENCIAS ----------
  async getCompetencies(syllabusId: string) {
    return syllabusRepository.listCompetencies(syllabusId);
  }

  async getSumilla(silaboSumillaId: number) {
    return syllabusRepository.findSumillaById(silaboSumillaId);
  }

  async removeCompetency(syllabusId: string, id: string) {
    const { deleted } = await syllabusRepository.deleteCompetency(
      syllabusId,
      id,
    );
    if (!deleted)
      throw new AppError("NotFound", "NOT_FOUND", "Competency not found");
    return { ok: true, deleted, message: "🗑️ El item fue eliminado con éxito" };
  }

  async createCompetencies(syllabusId: string, body: unknown) {
    const parsed = UpsertCompetenciesSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new AppError("BadRequest", "BAD_REQUEST", details);
    }

    // OrderSchema en types.ts ya transforma a number | undefined
    const items = parsed.data.items.map(({ text, order, code }) => ({
      text,
      order: order ?? null, // si tu DB quiere null; si acepta undefined, puedes dejar `order`
      code: code ?? null,
    }));

    const res = await syllabusRepository.insertCompetencies(syllabusId, items);
    return {
      ok: true as const,
      inserted: res.inserted,
      message: "El item se creo con éxito!!",
    };
  }

  // ---------- COMPONENTES ----------
  async getComponents(syllabusId: string) {
    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }
    const rows = await syllabusRepository.listComponents(sId);
    // ideal si el repo ya alias: descripcion->text, codigo->code, orden->order
    return rows.map((r: any) => ({
      id: r.id,
      silaboId: r.silaboId ?? r.silabo_id,
      text: r.text ?? r.descripcion,
      order: r.order ?? r.orden ?? null,
      code: r.code ?? r.codigo ?? null,
    }));
  }

  async createComponents(syllabusId: string, body: unknown) {
    const parsed = CreateComponentsSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new AppError("BadRequest", "BAD_REQUEST", details);
    }

    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }

    const items = parsed.data.items.map(({ text, order, code }) => ({
      text,
      order: order ?? null, // aprovechando la transform de OrderSchema
      code: code ?? null,
    }));

    const { inserted } = await syllabusRepository.insertComponents(sId, items);
    return {
      ok: true as const,
      inserted,
      message: "El item se creo con éxito!!",
    };
  }

  async removeComponent(syllabusId: string, id: string) {
    const sId = Number(syllabusId);
    const cId = Number(id);
    if (Number.isNaN(sId) || Number.isNaN(cId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "Parámetros inválidos");
    }
    const { deleted } = await syllabusRepository.deleteComponent(sId, cId);
    if (!deleted) {
      throw new AppError("NotFound", "NOT_FOUND", "Component not found");
    }
    return { ok: true, deleted, message: "🗑️ El item fue eliminado con éxito" };
  }

  async findSyllabusAndUpdate(id: number) {
    console.log(id);
  }

  async getGeneralDataSyllabusById(id: number) {
    const data = await syllabusRepository.findGeneralDataById(id);
    if (!data) throw new AppError("Sílabo no encontrado", "NOT_FOUND");
    return data;
  }

  async createSyllabus(payload: unknown) {
    let data;
    try {
      // Validación con Zod
      data = SyllabusCreateSchema.parse(payload);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new AppError(
          "ValidationError",
          "BAD_REQUEST",
          "Datos inválidos: " +
            error.issues.map((e: any) => e.message).join(", "),
        );
      }
      throw error;
    }

    // (Opcional) reglas de negocio antes del insert
    // Ej: validar que el código no esté repetido
    // const existing = await this.repository.findByCodigo(data.codigoAsignatura);
    // if (existing) throw new Error("El sílabo ya existe para este código de asignatura.");

    const idNewSyllabus = await syllabusRepository.create(data);
    return idNewSyllabus;
  }

  // ---------- CONTENIDOS ACTITUDINALES ----------
  async getAttitudes(syllabusId: string) {
    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }
    const rows = await syllabusRepository.listAttitudes(sId);
    return rows.map((r: any) => ({
      id: r.id,
      silaboId: r.silaboId ?? r.silabo_id,
      text: r.descripcion ?? r.text,
      order: r.orden ?? r.order ?? null,
      code: r.code ?? r.codigo ?? null,
    }));
  }

  async createAttitudes(syllabusId: string, body: unknown) {
    const parsed = CreateAttitudesSchema.safeParse(body);
    if (!parsed.success) {
      const details = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      throw new AppError("BadRequest", "BAD_REQUEST", details);
    }

    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }

    const items = parsed.data.items.map(({ text, order, code }) => ({
      text,
      order: order ?? null,
      code: code ?? null,
    }));

    const { inserted } = await syllabusRepository.insertAttitudes(sId, items);
    return {
      ok: true as const,
      inserted,
      message: "El item se creo con éxito!!",
    };
  }

  async removeAttitude(syllabusId: string, id: string) {
    const sId = Number(syllabusId);
    const aId = Number(id);
    if (Number.isNaN(sId) || Number.isNaN(aId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "Parámetros inválidos");
    }
    const { deleted } = await syllabusRepository.deleteAttitude(sId, aId);
    if (!deleted) {
      throw new AppError(
        "NotFound",
        "NOT_FOUND",
        "No se encontró el elemento para eliminar",
      );
    }
    return {
      ok: true as const,
      deleted,
      message: "🗑️ El item se elimino con éxito",
    };
  }
  async updateSumilla(idSyllabus: number, payload: unknown) {
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
    await syllabusRepository.updateSumilla(idSyllabus, sumilla);

    return { message: "Sumilla registrada correctamente" };
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
    await syllabusRepository.saveSumilla(idSyllabus, sumilla);

    return { message: "Sumilla registrada correctamente" };
  }
}

export const syllabusService = new SyllabusService();
