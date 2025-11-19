import type { Response } from "./response.type";

export type TTokenProfit = {
  _id: string;
  name: string;
  percentage: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TTokenProfitResponse = Response<TTokenProfit>;
export type TTokenProfitsResponse = Response<TTokenProfit[]>;

