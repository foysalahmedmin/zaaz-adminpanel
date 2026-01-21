import type { TPackagePrice } from "./package.type";
import type { TPlan } from "./plan.type";
import type { Response } from "./response.type";

export type TPackagePlan = {
  _id: string;
  plan: TPlan | string;
  package: string | { _id: string; name: string; [key: string]: any };
  previous_price?: TPackagePrice;
  price: TPackagePrice;
  credits: number;
  is_initial: boolean;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPackagePlanResponse = Response<TPackagePlan>;
export type TPackagePlansResponse = Response<TPackagePlan[]>;
