import * as bcrypt from "bcrypt";

class PasswordService {
  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 4);
  }
  public async compare(reqPass: string, hashPass: string): Promise<boolean> {
    return await bcrypt.compare(reqPass, hashPass);
  }
}
export const passwordService = new PasswordService();
