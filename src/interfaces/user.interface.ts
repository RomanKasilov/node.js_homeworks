import { GenderEnum } from "../enums/genderEnum";

export interface IUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  gender?: GenderEnum;
  password: string;
  role: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  createAt: Date;
  updateAt: Date;
}
export type ILoginUser = Pick<IUser, "email" | "password">;
export type ForgotPasswordSetType = Pick<IUser, "password"> & { token: string };
