import { NextFunction, Request, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/tokenType.enum";
import { ApiError } from "../errors/api.error";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { jwtService } from "../services/jwt.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      const payload = jwtService.verifyToken(accessToken, TokenTypeEnum.ACCESS);
      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.jwtPayload = payload;
      req.res.locals.tokenId = pair._id;

      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }
      const refreshToken = header.split("Bearer ")[1];
      const payload = jwtService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.jwtPayload = payload;
      req.res.locals.refreshToken = refreshToken;

      next();
    } catch (e) {
      next(e);
    }
  }
  public checkActionToken(type: ActionTokenTypeEnum) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const token = req.body.token as string;
        if (!token) {
          throw new ApiError("Token is not provided", 401);
        }
        const payload = jwtService.verifyToken(token, type);
        const tokenFromDB = await actionTokenRepository.getByToken(token);
        if (!tokenFromDB) {
          throw new ApiError("Token is not valid", 401);
        }
        req.res.locals.jwtPayload = payload;
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}
export const authMiddleware = new AuthMiddleware();
