import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async create(data: IUser): Promise<IUser> {
    await this.isEmailExistOrThrow(data.email);
    return await userRepository.create(data);
  }

  public async getById(userId: string): Promise<IUser> {
    const user = userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Not found", 404);
    }
    return await user;
  }

  public async updateById(userId: string, data: IUser): Promise<IUser> {
    return await userRepository.updateById(userId, data);
  }

  public async deleteById(userId: string): Promise<void> {
    return await userRepository.deleteById(userId);
  }
  private async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await userRepository.getByEmail(email);
    if (user) {
      throw new ApiError("Email already exists", 409);
    }
  }
}

export const userService = new UserService();
