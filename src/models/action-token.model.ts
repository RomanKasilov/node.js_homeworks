import { model, Schema, Types } from "mongoose";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.interface";
import { User } from "./user.model";

const actionTokenSchema = new Schema(
  {
    token: { type: String, required: true },
    type: { type: String, enum: ActionTokenTypeEnum, required: true },
    _userId: { type: Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = model<IActionToken>(
  "action-tokens",
  actionTokenSchema,
);
