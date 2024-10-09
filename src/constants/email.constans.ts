import { EmailTypeEnum } from "../enums/emailType.enum";

export const emailConstants = {
  [EmailTypeEnum.WELCOME]: {
    subject: "Welcome to our platform",
    template: "welcome",
  },
  [EmailTypeEnum.FORGOT_PASSWORD]: {
    subject: "Forgot password",
    template: "forgot-password",
  },
  [EmailTypeEnum.OLD_VISIT]: {
    subject: "Old visit",
    template: "old-visit",
  },
  [EmailTypeEnum.LOGOUT]: {
    subject: "logout",
    template: "logout",
  },
};
