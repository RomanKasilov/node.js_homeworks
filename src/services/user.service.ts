import { UploadedFile } from "express-fileupload";

import { FileItemTypeEnum } from "../enums/file-item.type-enum";
import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";

class UserService {
  public async getAll(): Promise<IUser[]> {
    return await userRepository.getAll();
  }

  public async getById(userId: string): Promise<IUser> {
    const user = userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Not found", 404);
    }
    return await user;
  }

  public async getMe(userId: string): Promise<IUser> {
    const user = userRepository.getById(userId);
    if (!user) {
      throw new ApiError("Not found", 404);
    }
    return await user;
  }
  public async updateMe(userId: string, data: IUser): Promise<IUser> {
    return await userRepository.updateById(userId, data);
  }

  public async deleteMe(userId: string): Promise<void> {
    return await userRepository.deleteById(userId);
  }
  public async uploadAvatar(
    userId: string,
    file: UploadedFile,
  ): Promise<IUser> {
    const user = await userRepository.getById(userId);
    const avatar = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      user._id,
    );
    const updatedUser = await userRepository.updateById(user._id, { avatar });
    return updatedUser;
  }
}

export const userService = new UserService();
