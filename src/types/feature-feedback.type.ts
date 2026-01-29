import type { TResponse } from "./response.type";

export type TFeatureFeedback = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  feature: {
    _id: string;
    name: string;
    value: string;
  };
  rating: number;
  comment: string;
  category: "suggestion" | "bug" | "compliment" | "other";
  status: "pending" | "reviewed" | "resolved";
  admin_note?: string;
  created_at: string;
  updated_at: string;
};

export type TFeatureFeedbackResponse = TResponse<TFeatureFeedback>;
export type TFeatureFeedbacksResponse = TResponse<TFeatureFeedback[]>;
