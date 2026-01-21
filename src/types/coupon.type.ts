import type { Response } from "./response.type";

export type TDiscountType = "percentage" | "fixed";

export type TCoupon = {
  _id: string;
  code: string;
  discount_type: TDiscountType;
  discount_value: number;
  fixed_amount: {
    USD: number;
    BDT: number;
  };
  min_purchase_amount: {
    USD: number;
    BDT: number;
  };
  max_discount_amount: {
    USD: number;
    BDT: number;
  };
  valid_from: string;
  valid_until: string;
  usage_limit: number;
  usage_count: number;
  applicable_packages: string[];
  is_active: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TCouponResponse = Response<TCoupon>;
export type TCouponsResponse = Response<TCoupon[]>;
