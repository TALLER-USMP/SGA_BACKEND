import { AppError } from "../../error";
import { syllabusRepository } from "../syllabus/repository";
import { teacherRepository } from "../teacher/repository";
import { assignmentsRepository } from "./repository";
import type {
  CreateAssignmentRequest,
  SilaboFilters,
  SilaboListItem,
} from "./types";

class AssignmentsService {
  async list(filters: SilaboFilters): Promise<SilaboListItem[]> {
    return await assignmentsRepository.getAll(filters);
  }

  async create(assignmentPayload: CreateAssignmentRequest) {
    const teacher = await teacherRepository.findById(
      assignmentPayload.teacherId,
    );

    if (!teacher) {
      throw new AppError(
        "Docente no encontrado",
        "BAD_REQUEST",
        "El docente no existe.",
      );
    }

    const syllabus = await syllabusRepository.findById(
      assignmentPayload.syllabusId,
    );
    if (!syllabus) {
      throw new AppError(
        "Sílabo no encontrado",
        "BAD_REQUEST",
        "El sílabo no existe.",
      );
    }

    if (syllabus.asignadoADocenteId === assignmentPayload.teacherId) {
      throw new AppError(
        "Conflicto de asignación",
        "BAD_REQUEST",
        "El docente no puede asignarse a sí mismo.",
      );
    }

    const createAssigment = {
      syllabus: {
        id: syllabus.id,
        name: syllabus.cursoNombre,
        code: syllabus.cursoCodigo,
        department: syllabus.departamentoAcademico,
      },
      teacher: {
        id: teacher.id,
        email: teacher.correo,
        name: teacher.nombre,
      },
      message: assignmentPayload.message,
      academyPeriod: assignmentPayload.academicPeriod,
    };

    await assignmentsRepository.create(createAssigment);
  }
}

export const assignmentsService = new AssignmentsService();
