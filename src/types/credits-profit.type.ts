import type { TResponse } from "./response.type";

export type TCreditsProfit = {
  _id: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TCreditsProfitResponse = TResponse<TCreditsProfit>;
export type TCreditsProfitsResponse = TResponse<TCreditsProfit[]>;
