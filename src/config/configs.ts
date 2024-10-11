import dotenv from "dotenv";

dotenv.config();

export const configs = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,
  APP_EMAIL: process.env.APP_EMAIL,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  APP_FRONT_URL: process.env.APP_FRONT_URL,
};
