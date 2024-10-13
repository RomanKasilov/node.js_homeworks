import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/emailType.enum";
import { timeHelper } from "../helper/time-helper";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParamsToDate(1, "d");
    const users = await userRepository.findOldVisitors(date);
    await Promise.all(
      users.map(async (user: IUser) => {
        await emailService.sendEmail(user.email, EmailTypeEnum.OLD_VISIT, {
          name: user.name,
        });
      }),
    );
    console.log(` sent ${users.length} emails to old visitors`);
  } catch (e) {
    console.error(e);
  }
};

export const oldVisitorCronJob = new CronJob("1 * * 9 *", handler);
