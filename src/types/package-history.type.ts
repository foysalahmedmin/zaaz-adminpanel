import type { Response } from "./response.type";
import type { TPackagePrice } from "./package.type";
import type { TFeature } from "./feature.type";
import type { TPlan } from "./plan.type";
import type { TPackagePlan } from "./package-plan.type";

// Embedded feature data structure for history
export type TFeatureHistory = TFeature;

// Embedded plan data structure for history
export type TPlanHistory = TPlan;

// Embedded package-plan data structure for history
export type TPackagePlanHistory = {
  _id: string;
  plan: TPlanHistory;
  price: TPackagePrice;
  previous_price?: TPackagePrice;
  token: number;
  is_initial: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPackageHistory = {
  _id: string;
  package: string;
  name: string;
  description?: string;
  content?: string;
  features: TFeatureHistory[]; // Embedded feature objects
  plans: TPackagePlanHistory[]; // Embedded package-plan objects with plan
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPackageHistoryResponse = Response<TPackageHistory>;
export type TPackageHistoriesResponse = Response<TPackageHistory[]>;

