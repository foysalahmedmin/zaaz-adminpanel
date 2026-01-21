import type { Response } from "./response.type";

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

export type TUserWalletResponse = Response<TUserWallet>;
export type TUserWalletsResponse = Response<TUserWallet[]>;
