export interface IUser {
  _id: string;
  name: string;
  age: number;
  email: string;
  gender?: string;
  password: string;
  role: string;
  isVerified?: boolean;
  isDeleted?: boolean;
  createAt: Date;
  updateAt: Date;
}
