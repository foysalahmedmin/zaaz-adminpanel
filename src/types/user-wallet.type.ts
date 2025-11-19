import type { Response } from "./response.type";

export type TUserWallet = {
  _id: string;
  user: string;
  package: string;
  token: number;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type TUserWalletResponse = Response<TUserWallet>;
export type TUserWalletsResponse = Response<TUserWallet[]>;

