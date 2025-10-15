import * as jwt from "jsonwebtoken";
import { authRepository } from "./repository";
import {
  AuthorizedUser,
  LoginResponse,
  MicrosoftJwtPayload,
  SessionResponse,
  UserSession,
} from "./types";
import { AppError } from "../../error";
import { getKey } from "./utils";

class AuthService {
  private verifyMicrosoftToken(token: string): Promise<MicrosoftJwtPayload> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          algorithms: ["RS256"],
          audience: process.env.AZURE_CLIENT_ID,
          issuer: [
            `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
            `https://sts.windows.net/${process.env.AZURE_TENANT_ID}/`,
          ],
        },
        (err, decoded) => {
          if (err) {
            reject(new AppError("Unauthorized", "UNAUTHORIZED"));
          } else {
            resolve(decoded as MicrosoftJwtPayload);
          }
        },
      );
    });
  }

  private generateOurJwt(user: AuthorizedUser, role: number): string {
    const payload: UserSession = {
      id: user.id,
      email: user.correo,
      role: role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
  }

  public async login(msToken: string): Promise<LoginResponse> {
    const msPayload = await this.verifyMicrosoftToken(msToken);
    const userEmail = msPayload.email.toLowerCase();

    let userRecord = await authRepository.findUserByEmail(userEmail);

    if (userRecord) {
      await authRepository.updateLastAccess(userRecord.user.id, msPayload);
    } else {
      userRecord = await authRepository.createUser(msPayload);
    }

    const ourToken = this.generateOurJwt(
      userRecord.user,
      userRecord.category.id,
    );

    return {
      token: ourToken,
      user: {
        id: userRecord.user.id,
        email: userRecord.user.correo,
        role: userRecord.category.id,
      },
    };
  }

  public async sessionMe(ourToken: string): Promise<SessionResponse> {
    const decoded = jwt.verify(
      ourToken,
      process.env.OUR_JWT_SECRET!,
    ) as UserSession;
    const userId = decoded.id;

    const userAndCategory = await authRepository.findUserByEmail(decoded.email);

    if (!userAndCategory || !userAndCategory.user.activo) {
      throw new AppError("Unauthorized", "UNAUTHORIZED");
    }

    const newToken = this.generateOurJwt(
      userAndCategory.user,
      userAndCategory.category.id,
    );
    await authRepository.updateOnlyLastAccess(userId);

    return {
      token: newToken,
      user: {
        id: userAndCategory.user.id,
        email: userAndCategory.user.correo,
        role: userAndCategory.category.id,
      },
    };
  }
}

export const authService = new AuthService();
