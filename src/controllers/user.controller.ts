import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.send(users);
    } catch (e) {
      next(e);
    }
  }
  public async getById(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.userId;
    try {
      const user = await userService.getById(userId);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(req: Request, res: Response, next: NextFunction) {
    const payload = req.res.locals.jwtPayload as ITokenPayload;
    try {
      const user = await userService.getById(payload.id);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as IUser;
      const payload = req.res.locals.jwtPayload as ITokenPayload;

      const result = await userService.updateMe(payload.id, data);

      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.res.locals.jwtPayload as ITokenPayload;
      await userService.deleteMe(payload.id);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
