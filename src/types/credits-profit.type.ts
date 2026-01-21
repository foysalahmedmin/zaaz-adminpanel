import type { Response } from "./response.type";

export type TCreditsProfit = {
  _id: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TCreditsProfitResponse = Response<TCreditsProfit>;
export type TCreditsProfitsResponse = Response<TCreditsProfit[]>;
