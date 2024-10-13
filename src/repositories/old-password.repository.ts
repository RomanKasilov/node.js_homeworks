import { FilterQuery } from "mongoose";

import { IOldPassword } from "../interfaces/old-password.interface";
import { OldPassword } from "../models/old-password.model";

class OldPasswordRepository {
  public async create(data: IOldPassword): Promise<IOldPassword> {
    return await OldPassword.create(data);
  }

  public async findAllByUserId(userId: string): Promise<IOldPassword[]> {
    return await OldPassword.find({ _userId: userId });
  }

  public async deleteManyByParams(
    params: FilterQuery<IOldPassword>,
  ): Promise<number> {
    const { deletedCount } = await OldPassword.deleteMany(params);
    return deletedCount;
  }
}
export const oldPasswordRepository = new OldPasswordRepository();
