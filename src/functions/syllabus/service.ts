import { syllabusRepository } from "./repository";
import {
  UpsertCompetenciesSchema,
  CodeSchemaComponent, // letra.número (p.ej. g.1)
  CodeSchemaAttitude, // solo letra (p.ej. b)
  OrderSchema, // number | "123" | null -> number | undefined
} from "./types";
import { AppError } from "../../error";
import { z } from "zod";

//1
const CreateComponentsSchema = z.object({
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Deberias completar el campo 'text' "),
        code: CodeSchemaComponent.optional(), // g.1, g.2...
        order: OrderSchema, // acepta 2, "2" o null
      }),
    )
    .min(1, "items requerido"),
});

const CreateAttitudesSchema = z.object({
  items: z
    .array(
      z.object({
        text: z.string().min(1, "Deberias completar el campo 'text' "),
        code: CodeSchemaAttitude.optional(), // b, c, f...
        order: OrderSchema, // acepta 2, "2" o null
      }),
    )
    .min(1, "items requerido"),
});

export class SyllabusService {
  // ---------- COMPETENCIAS ----------
  async getCompetencies(syllabusId: string) {
    return syllabusRepository.listCompetencies(syllabusId);
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

    const items = parsed.data.items.map(({ text, order, code }) => ({
      text,
      order: typeof order === "number" ? order : null,
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
    // <-- async (no "sync")
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
      order: typeof order === "number" ? order : null,
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
      code: r.code ?? r.codigo ?? null, // incluir code si el repo lo devuelve
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
      order: typeof order === "number" ? order : null,
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
      message: "🗑️ El item fue eliminado con éxito",
    };
  }
}

export const syllabusService = new SyllabusService();
