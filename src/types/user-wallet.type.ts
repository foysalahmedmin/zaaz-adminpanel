import type { TResponse } from "./response.type";

export type TUserWallet = {
  _id: string;
  user: string;
  email?: string;
  package?:
    | string
    | {
        _id: string;
        name: string;
      }
    | null;
  plan?:
    | string
    | {
        _id: string;
        name: string;
      }
    | null;
  credits: number;
  type: "free" | "paid";
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type TUserWalletResponse = TResponse<TUserWallet>;
export type TUserWalletsResponse = TResponse<TUserWallet[]>;
