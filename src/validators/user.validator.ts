import joi from "joi";

import { regexConstants } from "../constants/regex.constans";
import { GenderEnum } from "../enums/genderEnum";

export class UserValidator {
  private static name = joi.string().min(3).max(20).trim();
  private static age = joi.number().min(1).max(120);
  private static email = joi
    .string()
    .lowercase()
    .trim()
    .regex(regexConstants.EMAIL);
  private static gender = joi.string().valid(...Object.values(GenderEnum));
  private static password = joi.string().trim().regex(regexConstants.PASSWORD);

  public static create = joi.object({
    name: this.name.required(),
    age: this.age.required(),
    email: this.email.required(),
    password: this.password.required(),
    gender: this.gender,
  });
  public static update = joi.object({
    name: this.name,
    age: this.age,
    gender: this.gender,
  });
}
