import type { TResponse } from "./response.type";

export type TUserWallet = {
  _id: string;
  user: string;
  email?: string;
  credits: number;
  initial_credits_given?: boolean;
  initial_package_given?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TUserWalletResponse = TResponse<TUserWallet>;
export type TUserWalletsResponse = TResponse<TUserWallet[]>;
