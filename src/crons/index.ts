import { oldVisitorCronJob } from "./old-visitor.cron";
import { removeOldPasswordsJob } from "./remove-old-passwords.cron";
import { removeOldTokensCronJob } from "./remove-old-tokens.cron";

export const cronRunner = () => {
  removeOldTokensCronJob.start();
  removeOldPasswordsJob.start();
  oldVisitorCronJob.start();
};
