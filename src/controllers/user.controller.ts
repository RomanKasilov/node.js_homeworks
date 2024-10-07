import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await userService.getAll();
      res.send(users);
    } catch (e) {
      next(e);
    }
  }
  public async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const userId = req.params.userId;
    try {
      const user = await userService.getById(userId);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const payload = req.res.locals.jwtPayload as ITokenPayload;
    try {
      const user = await userService.getMe(payload.userId);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = req.body as IUser;
      const payload = req.res.locals.jwtPayload as ITokenPayload;

      const result = await userService.updateMe(payload.userId, data);

      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const payload = req.res.locals.jwtPayload as ITokenPayload;
      await userService.deleteMe(payload.userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
