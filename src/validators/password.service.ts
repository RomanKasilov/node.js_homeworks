import * as bcrypt from "bcrypt";

class PasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 4);
  }
  async compare(reqPass: string, hashPass: string): Promise<boolean> {
    return await bcrypt.compare(reqPass, hashPass);
  }
}
export const passwordService = new PasswordService();
