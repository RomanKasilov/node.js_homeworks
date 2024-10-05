import * as jwt from "jsonwebtoken";

import { configs } from "../config/configs";
import { TokenTypeEnum } from "../enums/tokenType.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class JwtService {
  public createTokenPair(payload: ITokenPayload): ITokenPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRATION,
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: configs.JWT_REFRESH_EXPIRATION,
    });
    return { accessToken, refreshToken };
  }
  public verifyToken(token: string, tokenType: TokenTypeEnum): ITokenPayload {
    try {
      let secret: string;
      switch (tokenType) {
        case TokenTypeEnum.ACCESS:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      console.log(e);
      throw new ApiError("Invalid token", 401);
    }
  }
}
export const jwtService = new JwtService();
