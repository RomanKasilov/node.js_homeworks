import { EmailTypeEnum } from "../enums/emailType.enum";
import { ApiError } from "../errors/api.error";
import {
  ITokenPair,
  ITokenPayload,
  IUserWithTokens,
} from "../interfaces/token.interface";
import { ILoginUser, IUser } from "../interfaces/user.interface";
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
    await emailService.sendEmail(
      "kasiakasilov@gmail.com",
      EmailTypeEnum.WELCOME,
      { name: user.name },
    ); //data.email
    return { user, tokenPair };
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
    await emailService.sendEmail(
      "kasiakasilov@gmail.com",
      EmailTypeEnum.LOGOUT,
      {
        name: user.name,
      },
    );
    await tokenRepository.deleteOneByParams({ _id: tokenId });
  }
  public async logoutAll(payload: ITokenPayload): Promise<void> {
    const user = await userRepository.getById(payload.userId);
    await tokenRepository.deleteManyByParams({ userId: payload.userId });
    await emailService.sendEmail(
      "kasiakasilov@gmail.com",
      EmailTypeEnum.LOGOUT,
      {
        name: user.name,
      },
    );
  }
}
export const authService = new AuthService();
