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
