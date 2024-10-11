import * as jwt from "jsonwebtoken";

import { configs } from "../config/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
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
  public generateActionToken(
    payload: ITokenPayload,
    tokenType: ActionTokenTypeEnum,
  ): string {
    let secret;
    let expiresIn;

    switch (tokenType) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = configs.JWT_ACTION_FORGOT_PASSWORD_SECRET;
        expiresIn = configs.JWT_ACTION_FORGOT_PASSWORD_EXPIRATION;
        break;
      case ActionTokenTypeEnum.VERIFY_EMAIL:
        secret = configs.JWT_ACTION_VERIFY_SECRET;
        expiresIn = configs.JWT_ACTION_VERIFY_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid token type", 400);
    }

    return jwt.sign(payload, secret, { expiresIn });
  }
  public verifyToken(
    token: string,
    tokenType: TokenTypeEnum | ActionTokenTypeEnum,
  ): ITokenPayload {
    try {
      let secret: string;
      switch (tokenType) {
        case TokenTypeEnum.ACCESS:
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = configs.JWT_REFRESH_SECRET;
          break;
        case ActionTokenTypeEnum.FORGOT_PASSWORD:
          secret = configs.JWT_ACTION_FORGOT_PASSWORD_SECRET;
          break;
        case ActionTokenTypeEnum.VERIFY_EMAIL:
          secret = configs.JWT_ACTION_VERIFY_SECRET;
          break;
        default:
          throw new ApiError("Invalid token type", 400);
      }
      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      console.log(e);
      throw new ApiError("Invalid token", 401);
    }
  }
}
export const jwtService = new JwtService();
