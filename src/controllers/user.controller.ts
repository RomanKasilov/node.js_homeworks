import { NextFunction, Request, Response } from "express";

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

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as IUser;
      const result = await userService.create(data);

      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }
  public async getById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id;
    try {
      const user = await userService.getById(id);
      res.send(user);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as IUser;
      const id = Number(req.params.id);

      const result = await userService.updateById(id, data);

      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }

  public async changeById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      const data = req.body as Partial<IUser>;
      const result = await userService.changeById(id, data);
      res.status(201).send(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = +req.params.id;
      await userService.deleteById(id);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
