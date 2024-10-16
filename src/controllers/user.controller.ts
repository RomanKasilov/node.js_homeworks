import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userPresenter } from "../presenters/user.presenters";
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
      const result = userPresenter.toPublicResDto(user);
      res.send(result);
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
      const result = userPresenter.toPublicResDto(user);
      res.send(result);
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

      const user = await userService.updateMe(payload.userId, data);
      const result = userPresenter.toPublicResDto(user);

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
  public async uploadAvatar(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.jwtPayload as ITokenPayload;
      const avatar = req.files.avatar as UploadedFile;
      console.log(avatar);
      const user = await userService.uploadAvatar(userId, avatar);
      const result = userPresenter.toPublicResDto(user);
      res.json(result).status(201);
    } catch (e) {
      next(e);
    }
  }
  public async deleteAvatar(
      req: Request,
      res: Response,
      next: NextFunction,
  ): Promise<void>{
   try{
     const { userId } = req.res.locals.jwtPayload as ITokenPayload;
     const user = await userService.deleteAvatar(userId)
     const result = userPresenter.toPublicResDto(user)
     res.json(result).status(201)

   }catch (e){
     next(e)
   }

  }

}

export const userController = new UserController();
