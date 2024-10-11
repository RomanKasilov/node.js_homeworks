import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.create),
  authController.register,
);
router.post(
  "/verify",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verify,
);
router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/logout/all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);
router.post("/forgot-password", authController.forgotSendEmail);
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotSetPassword,
);

export const authRouter = router;
