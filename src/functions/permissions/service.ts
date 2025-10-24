import { log } from "console";
import { AppError } from "../../error";
import { permissionsRepository } from "./repository";

export class PermissionsService {
  async getAllSyllabusDocente() {
    try {
      const rows = await permissionsRepository.findAllSyllabusDocente();
      const result = rows.map((r) => ({
        id: r.id,
        silabo: {
          silaboId: r.silaboId,
          cursoNombre: r.cursoNombre,
        },
        docente: {
          docenteId: r.docenteId,
          nombreDocente: r.nombreDocente,
        },
      }));

      return result;
    } catch (error) {
      throw new AppError(
        "PermissionsServiceError",
        "INTERNAL_SERVER_ERROR",
        "Error al obtener los syllabus del docente",
      );
    }
  }

  async getPermissionsByLevel(
    level: "micro" | "macro",
    silaboDocenteId?: number,
  ) {
    if (level === "macro") {
      return await permissionsRepository.findAllPermissions();
    }
    // Excluir secciones según los criterios de la HU
    const excluded = [
      "datos_generales",
      "sumilla",
      "competencias",
      "componentes",
    ];
    const silaboDocente = await permissionsRepository.findSyllaboDocenteById(
      silaboDocenteId as number,
    );
    log(silaboDocenteId);
    if (silaboDocente.length === 0) {
      throw new AppError(
        "PermissionsServiceError",
        "NOT_FOUND",
        "No se encontró el silaboDocenteId proporcionado",
      );
    }
    const nameDocente = silaboDocente[0].nombreDocente;

    const permissionsDocente = await (
      await permissionsRepository.findAllPermissions()
    ).filter((p) => !excluded.includes(p.section));

    return {
      nombreDocente: nameDocente,
      permissions: permissionsDocente,
    };
  }
}

export const permissionsService = new PermissionsService();
