import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { configs } from "./config/configs";
import { ApiError } from "./errors/api.error";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(err.message);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error.message, error.stack);
  process.exit(1);
});

app.listen(configs.APP_PORT, async () => {
  await mongoose.connect(configs.MONGO_URI);
  console.log(
    `Server is running on http://${configs.APP_HOST}:${configs.APP_PORT}`,
  );
});
