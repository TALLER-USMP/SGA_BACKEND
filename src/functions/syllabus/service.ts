import { syllabusRepository } from "./repository";
import { UpsertCompetenciesSchema } from "./types";
import { AppError } from "../../error";
import { z } from "zod";

// Zod para crear actitudes
const CreateAttitudesSchema = z.object({
  items: z
    .array(
      z.object({
        text: z.string().min(1, "text requerido"),
        order: z.number().int().nonnegative().optional(),
      }),
    )
    .min(1, "items requerido"),
});
//COMPONENTES
const CreateComponentsSchema = z.object({
  items: z
    .array(
      z.object({
        text: z.string().min(1, "text requerido"),
        order: z.number().int().nonnegative().optional(),
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
    return { ok: true, deleted };
  }
  async createCompetencies(syllabusId: string, body: unknown) {
    const parsed = UpsertCompetenciesSchema.safeParse(body);
    if (!parsed.success) {
      // Formatea errores de Zod de forma amigable
      const details = parsed.error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join("; ");
      // Usa el mismo "code" que ya usas en otros métodos para coherencia
      throw new AppError("BadRequest", "BAD_REQUEST", details);
    }

    // `order` ya viene normalizado como number | undefined
    const items = parsed.data.items.map(({ text, order }) => ({
      text,
      order: typeof order === "number" ? order : null, // tu repo espera null cuando no hay order
    }));

    const res = await syllabusRepository.insertCompetencies(syllabusId, items);
    return { ok: true as const, inserted: res.inserted };
  }
  // ---------- COMPONENTES ----------
  async getComponents(syllabusId: string) {
    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }
    const rows = await syllabusRepository.listComponents(sId);
    // devolver sin el prefijo [COMP]
    return rows.map((r) => ({
      id: r.id,
      silaboId: r.silaboId,
      text: r.descripcion, // ya viene limpiado del repo
      order: r.orden ?? null,
    }));
  }

  async createComponents(syllabusId: string, body: unknown) {
    const parsed = CreateComponentsSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError("BadRequest", "BAD_REQUEST", "Payload inválido");
    }
    const sId = Number(syllabusId);
    if (Number.isNaN(sId)) {
      throw new AppError("BadRequest", "BAD_REQUEST", "syllabusId inválido");
    }
    const { inserted } = await syllabusRepository.insertComponents(
      sId,
      parsed.data.items,
    );
    return { ok: true, inserted };
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
    return { ok: true, deleted };
  }
  // ---------- CONTENIDOS ACTITUDINALES ----------
  async getAttitudes(syllabusId: string) {
    return syllabusRepository.listAttitudes(Number(syllabusId));
  }

  async createAttitudes(syllabusId: string, body: unknown) {
    const { items } = CreateAttitudesSchema.parse(body);
    const { inserted } = await syllabusRepository.insertAttitudes(
      Number(syllabusId),
      items,
    );
    return { ok: true as const, inserted };
  }

  async removeAttitude(syllabusId: string, id: string) {
    const { deleted } = await syllabusRepository.deleteAttitude(
      Number(syllabusId),
      Number(id),
    );
    if (!deleted) {
      throw new AppError("NotFound", "NOT_FOUND", "Attitude not found");
    }
    return { ok: true as const, deleted };
  }
}

export const syllabusService = new SyllabusService();
