import { EmailTypeEnum } from "../enums/emailType.enum";
import { EmailPayloadCombinedType } from "./email-payload.combinedType";
import { PickRequired } from "./pick-required.type";

export type EmailPayloadType = {
  [EmailTypeEnum.WELCOME]: PickRequired<EmailPayloadCombinedType, "name">;
  [EmailTypeEnum.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombinedType,
    "email"
  >;
  [EmailTypeEnum.OLD_VISIT]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "email"
  >;
  [EmailTypeEnum.LOGOUT]: PickRequired<EmailPayloadCombinedType, "name">;
};
