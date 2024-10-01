import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({});
  }

  public async create(data: Partial<IUser>): Promise<IUser> {
    return await User.create(data);
  }

  public async getById(userId: string): Promise<IUser | undefined> {
    return await User.findById(userId);
  }

  public async updateById(userId: string, data: IUser): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
  public async getByEmail(email: string): Promise<IUser | undefined> {
    return await User.findOne({ email });
  }
}
export const userRepository = new UserRepository();
