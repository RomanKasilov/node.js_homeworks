import { configs } from "../config/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/emailType.enum";
import { ApiError } from "../errors/api.error";
import {
  ITokenPair,
  ITokenPayload,
  IUserWithTokens,
} from "../interfaces/token.interface";
import {
  ChangePasswordSetType,
  ILoginUser,
  IUser,
} from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "./email.service";
import { jwtService } from "./jwt.service";
import { passwordService } from "./password.service";

class AuthService {
  public async register(data: IUser): Promise<IUserWithTokens> {
    data.password = await passwordService.hash(data.password);
    await this.isEmailExistOrThrow(data.email);
    const user = await userRepository.create(data);

    const tokenPair = jwtService.createTokenPair({
      userId: user._id,
      name: user.name,
    });
    await tokenRepository.create({ ...tokenPair, userId: user._id });

    const actionToken = jwtService.generateActionToken(
      { userId: user._id, name: user.name },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );
    await actionTokenRepository.create({
      _userId: user._id,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
      token: actionToken,
    });
    await emailService.sendEmail(configs.APP_EMAIL, EmailTypeEnum.WELCOME, {
      name: user.name,
      actionToken,
    }); //data.email
    return { user, tokenPair };
  }

  public async verify(payload: ITokenPayload): Promise<void> {
    await userRepository.updateById(payload.userId, { isVerified: true });
    await actionTokenRepository.deleteManyByParams({
      _userId: payload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
  }

  public async login(data: ILoginUser): Promise<IUserWithTokens> {
    const user = await userRepository.getByEmail(data.email);
    if (!user) {
      throw new ApiError("Invalid password or login", 401);
    }
    const isInvalidPass = await passwordService.compare(
      data.password,
      user.password,
    );
    if (!isInvalidPass) {
      throw new ApiError("Invalid password or login", 401);
    }
    const tokenPair = jwtService.createTokenPair({
      userId: user._id,
      name: user.name,
    });
    await tokenRepository.create({ ...tokenPair, userId: user._id });
    return { user, tokenPair };
  }

  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }

  public async refreshToken(
    refreshToken: string,
    payload: ITokenPayload,
  ): Promise<ITokenPair> {
    await tokenRepository.deleteOneByParams({ refreshToken });
    const tokenPair = jwtService.createTokenPair({
      userId: payload.userId,
      name: payload.name,
    });
    await tokenRepository.create({ ...tokenPair, userId: payload.userId });
    return tokenPair;
  }

  public async logout(tokenId: string, payload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    await emailService.sendEmail(configs.APP_EMAIL, EmailTypeEnum.LOGOUT, {
      name: user.name,
    });
    await tokenRepository.deleteOneByParams({ _id: tokenId });
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    await tokenRepository.deleteManyByParams({ userId: payload.userId });
    await emailService.sendEmail(configs.APP_EMAIL, EmailTypeEnum.LOGOUT, {
      name: user.name,
    });
  }

  public async forgotPasswordSendEmail(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const token = jwtService.generateActionToken(
      { userId: user._id, name: user.name },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id,
      token,
    });
    await emailService.sendEmail(
      configs.APP_EMAIL,
      EmailTypeEnum.FORGOT_PASSWORD,
      {
        actionToken: token,
      },
    ); //user.email
  }

  public async forgotSetPassword(
    password: string,
    userId: string,
  ): Promise<void> {
    const hashedPassword = await passwordService.hash(password);
    await Promise.all([
      userRepository.updateById(userId, { password: hashedPassword }),
      actionTokenRepository.deleteManyByParams({
        _userId: userId,
        type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      }),
      tokenRepository.deleteManyByParams({ userId: userId }),
    ]);
  }
  public async changePassword(
    data: ChangePasswordSetType,
    userId: string,
  ): Promise<void> {
    const [user, oldPasswords] = await Promise.all([
      userRepository.getById(userId),
      oldPasswordRepository.findAllByUserId(userId),
    ]);
    const isPasswordCorrect = passwordService.compare(
      data.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid password", 401);
    }
    const usedPasswords = [...oldPasswords, { password: user.password }];
    await Promise.all(
      usedPasswords.map(async (item: { password: string }) => {
        const isUsed = await passwordService.compare(
          data.newPassword,
          item.password,
        );
        if (isUsed) {
          throw new ApiError("Password already used", 409);
        }
      }),
    );
    const password = await passwordService.hash(data.newPassword);
    await Promise.all([
      userRepository.updateById(userId, { password }),
      oldPasswordRepository.create({
        _userId: userId,
        password: user.password,
      }),
      tokenRepository.deleteManyByParams({ userId }),
    ]);
  }
}

export const authService = new AuthService();
