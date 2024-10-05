import { ApiError } from "../errors/api.error";
import { IUserWithTokens } from "../interfaces/token.interface";
import { ILoginUser, IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "../validators/password.service";
import { jwtService } from "./jwt.service";

class AuthService {
  public async register(data: IUser): Promise<IUserWithTokens> {
    data.password = await passwordService.hash(data.password);
    await this.isEmailExistOrThrow(data.email);
    const user = await userRepository.create(data);

    const tokenPair = jwtService.createTokenPair({
      id: user._id,
      name: user.name,
    });
    await tokenRepository.create({ ...tokenPair, userId: user._id });
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
      id: user._id,
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
}
export const authService = new AuthService();
