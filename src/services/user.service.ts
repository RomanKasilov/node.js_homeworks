import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async create(data: IUser): Promise<IUser> {
    if (!data.name || data.name.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters long",
        400,
      );
    }
    if (!data.email || data.email.search(/^(\w{3,16})(@gmail\.com)$/gm) !== 0) {
      throw new ApiError(
        "only for  gmail.com services name length 3- 16 characters",
        400,
      );
    }
    if (!data.password || data.password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters long",
        400,
      );
    }
    return await userRepository.create(data);
  }

  public async getById(userId: string) {
    const user = userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Not found", 404);
    }
    return await user;
  }

  public async updateById(userId: string, data: IUser): Promise<IUser> {
    if (!data.name || data.name.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters long",
        400,
      );
    }
    if (!data.email || data.email.search(/^(\w{3,16})(@gmail\.com)$/gm) !== 0) {
      throw new ApiError(
        "only for  gmail.com services name length 3- 16 characters",
        400,
      );
    }
    if (!data.password || data.password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters long",
        400,
      );
    }
    return await userRepository.updateById(userId, data);
  }

  public async deleteById(userId: string) {
    return await userRepository.deleteById(userId);
  }
}

export const userService = new UserService();
