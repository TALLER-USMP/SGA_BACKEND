import { log } from "console";
import { AppError } from "../../error";
import { z } from "zod";
import { revisionRepository } from "./repository";

export class RevisionService {
  async getAllCoursesAndState() {
    const result = await revisionRepository.findAllCourseAndStateBySilaboId();
    return result;
  }
}

export const revisionService = new RevisionService();
