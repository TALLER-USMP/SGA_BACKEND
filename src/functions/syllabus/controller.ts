import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { Updatable } from "../../types";
import { controller, route } from "../../lib/decorators";

@controller("syllabus")
export class SyllabusController implements Updatable {
  // PUT http://localhost:3000/apu/syllabus/
  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("not implemented");
  }
}
