import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(data: Partial<IToken>): Promise<void> {
    await Token.create(data);
  }
  public async findByParams(
    params: Partial<IToken>,
  ): Promise<IToken | undefined> {
    return await Token.findOne(params);
  }
  public async deleteOneByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteOne(params);
  }
  public async deleteManyByParams(params: Partial<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();
