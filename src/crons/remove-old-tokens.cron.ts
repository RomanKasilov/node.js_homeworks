import { CronJob } from "cron";

import { configs } from "../config/configs";
import { timeHelper } from "../helper/time-helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async (): Promise<void> => {
  try {
    const { value, unit } = timeHelper.parseConfigStringValue(
      configs.JWT_REFRESH_EXPIRATION,
    );
    const date = timeHelper.subtractPyParams(value, unit);
    const deletedCount = await tokenRepository.deleteOlderThan(date);
    console.log(`${deletedCount} old tokensPair was deleted`);
  } catch (e) {
    console.error(e);
  }
};

export const removeOldTokensCronJob = new CronJob("* */2 * * *", handler);
