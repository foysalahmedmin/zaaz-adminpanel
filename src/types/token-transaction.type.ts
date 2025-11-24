import type { Response } from "./response.type";

export type TTokenTransactionType = "increase" | "decrease";
export type TTokenTransactionIncreaseSource = "payment" | "bonus";

export type TTokenTransaction = {
  _id: string;
  user: string;
  user_wallet: string;
  type: TTokenTransactionType;
  token: number;
  increase_source?: TTokenTransactionIncreaseSource;
  decrease_source?: string; // FeatureEndpoint ID
  payment_transaction?: string;
  plan?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TTokenTransactionResponse = Response<TTokenTransaction>;
export type TTokenTransactionsResponse = Response<TTokenTransaction[]>;
