import { model, Schema } from "mongoose";

import { GenderEnum } from "../enums/genderEnum";
import { RoleEnum } from "../enums/roleEnum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 1,
      max: 199,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      enum: GenderEnum,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: RoleEnum,
      default: RoleEnum.USER,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("users", userSchema);
