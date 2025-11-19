import type { Response } from "./response.type";

export type TTokenProfitHistory = {
  _id: string;
  token_profit: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TTokenProfitHistoryResponse = Response<TTokenProfitHistory>;
export type TTokenProfitHistoriesResponse = Response<TTokenProfitHistory[]>;

