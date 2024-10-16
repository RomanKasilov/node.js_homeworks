import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";
import {fileMiddleware} from "../middlewares/file.middleware";
import {avatarConfig} from "../config/files.config";

const router = Router();

router.get("/", userController.getAll);

router.get(
  "me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("userId"),
  userController.getMe,
);
router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.update),
  userController.updateMe,
);
router.post(
  "/me/avatar",
    fileMiddleware.isFileValid('avatar', avatarConfig),
  authMiddleware.checkAccessToken,
  userController.uploadAvatar,
);
router.delete(
    "/me/avatar",
    authMiddleware.checkAccessToken,
    userController.deleteAvatar,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);
export const userRouter = router;
