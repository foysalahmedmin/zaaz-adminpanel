import type { TResponse } from "./response.type";

export type TCreditsProfitHistory = {
  _id: string;
  credits_profit: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TCreditsProfitHistoryResponse = TResponse<TCreditsProfitHistory>;
export type TCreditsProfitHistoriesResponse = TResponse<
  TCreditsProfitHistory[]
>;
