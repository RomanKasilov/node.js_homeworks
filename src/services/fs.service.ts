import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "../interfaces/user.interface";

const read = async (): Promise<IUser[]> => {
  try {
    const pathToDB = path.join(process.cwd(), "db.json");
    const data = await fs.readFile(pathToDB, { encoding: "utf8" });
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Ошибка чтения файла", e.message);
  }
};

const write = async (data: IUser[]): Promise<void> => {
  try {
    const pathToDB = path.join(process.cwd(), "db.json");
    await fs.writeFile(pathToDB, JSON.stringify(data));
  } catch (e) {
    console.log("Ошибка записи файла", e.message);
  }
};
export { read, write };
