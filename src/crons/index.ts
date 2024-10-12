import { removeOldTokensCronJob } from "./remove-old-tokens.cron";

export const cronRunner = () => {
  removeOldTokensCronJob.start();
};
