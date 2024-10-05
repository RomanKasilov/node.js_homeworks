import { NextFunction, Request, Response } from "express";

import { ILoginUser, IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as IUser;
      const result = await authService.register(body);
      res.send(result).status(201);
    } catch (e) {
      next(e);
    }
  }
  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ILoginUser;
      const result = await authService.login(body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}
export const authController = new AuthController();
