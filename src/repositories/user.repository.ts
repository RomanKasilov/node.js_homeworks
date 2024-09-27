import { ApiError } from "../errors/api.error";
import { IUser } from "../interfaces/user.interface";
import { read, write } from "../services/fs.service";

class UserRepository {
  public async getAll(): Promise<IUser[]> {
    return await read();
  }

  public async create(data: IUser) {
    const users = await read();
    const newUser = {
      id: users.length ? users[users.length - 1]?.id + 1 : 1,
      name: data.name,
      email: data.email,
      password: data.password,
    };
    users.push(newUser);
    await write(users);
    return newUser;
  }

  public async getById(userId: number): Promise<IUser | undefined> {
    const users = await read();
    return users.find((user) => user.id === userId);
  }

  public async updateById(id: number, data: IUser): Promise<IUser> {
    const users = await read();

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new ApiError("User not found", 404);
    }

    users[userIndex] = { ...users[userIndex], ...data };

    await write(users);

    return users[userIndex];
  }

  public async changeById(id: number, data: Partial<IUser>): Promise<IUser> {
    const users = await read();

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new ApiError("User not found", 404);
    }

    users[userIndex] = { ...users[userIndex], ...data };

    return users[userIndex];
  }

  public async deleteById(id: number): Promise<void> {
    const users = await read();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new ApiError("User not found", 404);
    }
    users.splice(userIndex, 1);
    await write(users);
  }
}

export const userRepository = new UserRepository();
