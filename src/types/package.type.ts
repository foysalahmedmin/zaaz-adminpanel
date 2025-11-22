import type { Response } from "./response.type";

export type TCurrency = "USD" | "BDT";

export type TPackagePrice = {
  USD: number;
  BDT: number;
};

export type TPackage = {
  _id: string;
  name: string;
  description?: string;
  content?: string;
  token: number;
  features: string[];
  duration?: number;
  price: TPackagePrice;
  price_previous?: TPackagePrice;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPackageResponse = Response<TPackage>;
export type TPackagesResponse = Response<TPackage[]>;
