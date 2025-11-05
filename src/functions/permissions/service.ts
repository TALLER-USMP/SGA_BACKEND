import { log } from "console";
import { AppError } from "../../error";
import { permissionsRepository } from "./repository";
import { z } from "zod";
import { PermissionsSchema } from "./types";

export class PermissionsService {
  async getPermissionsByDocenteId(docenteId: number) {
    const result =
      await permissionsRepository.findPermissionsByDocenteId(docenteId);
    return result;
  }

  async assignPermissions(body: unknown) {
    const parsed = PermissionsSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        "PermissionsServiceError",
        "BAD_REQUEST",
        "Error de validación",
        parsed.error.flatten().fieldErrors,
      );
    }
    return await permissionsRepository.savePermissionsBySilaboIdAndDocenteId(
      parsed.data.silaboId,
      parsed.data.docenteId,
      parsed.data.permisos,
    );
  }
}

export const permissionsService = new PermissionsService();
