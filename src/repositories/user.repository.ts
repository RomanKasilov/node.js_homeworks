import { IUser } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await User.find({});
  }

  public async create(data: Partial<IUser>): Promise<IUser> {
    return await User.create(data);
  }

  public async getById(userId: string): Promise<IUser | undefined> {
    return await User.findById(userId).select("+password");
  }

  public async updateById(
    userId: string,
    data: Partial<IUser>,
  ): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, data, { new: true });
  }

  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }
  public async getByEmail(email: string): Promise<IUser | undefined> {
    return await User.findOne({ email }).select("+password");
  }
  public async findOldVisitors(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      { $match: { tokens: { $size: 0 } } },
    ]);
  }
}
export const userRepository = new UserRepository();
