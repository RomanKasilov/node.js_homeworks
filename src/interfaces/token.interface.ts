import { IUser } from "./user.interface";

interface IToken {
  _id?: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
}
interface ITokenPayload {
  id: string;
  name: string;
}
interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
interface IUserWithTokens {
  user: IUser;
  tokenPair: ITokenPair;
}
export { IToken, ITokenPayload, ITokenPair, IUserWithTokens };
