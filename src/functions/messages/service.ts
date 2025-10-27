import { z } from "zod";
import { PermissionsSchema } from "../permissions/types";
import { AppError } from "../../error";

class MessagesService {
  async sendMessage(body: unknown) {
    const parsed = PermissionsSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError(
        "ERROR_PARAMETROS",
        "BAD_REQUEST",
        parsed.error.message,
      );
    }
  }
}

export const messagesService = new MessagesService();
