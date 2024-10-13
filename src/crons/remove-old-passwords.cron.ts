import { CronJob } from "cron";

import { timeHelper } from "../helper/time-helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParamsToDate(90, "d");
    const deletedCount = await oldPasswordRepository.deleteManyByParams({
      createdAt: { $lt: date },
    });
    console.log(`${deletedCount} old password(s) was deleted`);
  } catch (e) {
    console.error(e);
  }
};
export const removeOldPasswordsJob = new CronJob("* */1 * * *", handler);
