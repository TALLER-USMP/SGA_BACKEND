import { AppError } from "../../error";
import { docenteRepository } from "./repository";
import {
  TeacherProfileOutSchema,
  TeacherProfileUpdateSchema,
  type TeacherProfileOut,
} from "./types";

class TeacherService {
  async getProfile(docenteId: number): Promise<TeacherProfileOut> {
    const profile = await docenteRepository.findByDocenteId(docenteId);
    if (!profile) {
      throw new AppError("NotFound", "NOT_FOUND", "docenteId not found");
    }
    return TeacherProfileOutSchema.parse(profile);
  }

  async updateProfile(
    docenteId: number,
    payload: unknown,
  ): Promise<TeacherProfileOut> {
    const parsed = TeacherProfileUpdateSchema.parse(payload);

    const updated = await docenteRepository.updateByDocenteId(
      docenteId,
      parsed,
    );
    if (!updated) {
      throw new AppError("NotFound", "NOT_FOUND", "Docente no encontrado");
    }

    return TeacherProfileOutSchema.parse(updated);
  }
}

export const teacherService = new TeacherService();
