import { AppError } from "../../error";
import { teacherRepository } from "./repository";
import {
  TeacherProfileOutSchema,
  TeacherProfileUpdateSchema,
  TeacherListItemSchema,
  type TeacherProfileOut,
  type TeacherListResponse,
} from "./types";

class TeacherService {
  async listTeachers(): Promise<TeacherListResponse> {
    const teachers = await teacherRepository.findAll();

    // Validate each teacher item
    const validatedItems = teachers.map((teacher: any) =>
      TeacherListItemSchema.parse(teacher),
    );

    return {
      items: validatedItems,
      total: validatedItems.length,
    };
  }

  async getProfile(docenteId: number): Promise<TeacherProfileOut> {
    const profile = await teacherRepository.findById(docenteId);
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

    const updated = await teacherRepository.updateByDocenteId(
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
