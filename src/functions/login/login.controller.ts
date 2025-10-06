import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  HttpResponse,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { BaseController } from "../../base-controller";
import { STATUS_CODES } from "../../status-codes";
import { stat } from "fs";
import { verifyTokenWithMsal } from "../../utils/verifyTokenAzureMsal.utils";
import { AuthService } from "../../service/auth.service";

@controller("login")
export class LoginController implements BaseController {
  @route("/hookLogin", "POST")
  async login(
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.OK,
      jsonBody: { message: "funcional" },
    };
  }

  list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
