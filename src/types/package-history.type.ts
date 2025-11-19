import type { Response } from "./response.type";
import type { TPackagePrice } from "./package.type";

export type TPackageHistory = {
  _id: string;
  package: string;
  name: string;
  description?: string;
  content?: string;
  token: number;
  features: string[];
  duration?: number;
  price: TPackagePrice;
  previous_price?: TPackagePrice;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPackageHistoryResponse = Response<TPackageHistory>;
export type TPackageHistoriesResponse = Response<TPackageHistory[]>;

