import type { TFeature } from "./feature.type";
import type { TResponse } from "./response.type";

export type TFeaturePopupCategory = "single-time" | "multi-time";
export type TFeaturePopupActionType = "link" | "other";
export type TFeaturePopupActionVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "destructive"
  | "link";
export type TFeaturePopupActionSize =
  | "full"
  | "default"
  | "sm"
  | "lg"
  | "icon"
  | "icon-sm"
  | "icon-lg";
export type TFeaturePopupActionPosition = "header" | "footer" | "content";
export type TFeaturePopupSize = "sm" | "md" | "lg" | "xl" | "full";

export type TFeaturePopupAction = {
  name: string;
  path?: string;
  type: TFeaturePopupActionType;
  variant?: TFeaturePopupActionVariant;
  size?: TFeaturePopupActionSize;
  position?: TFeaturePopupActionPosition;
};

export type TFeaturePopup = {
  _id: string;
  feature: string | TFeature;
  name: string;
  value: string;
  description?: string;
  image?: string;
  video?: string;
  content?: string;
  actions?: TFeaturePopupAction[];
  category: TFeaturePopupCategory;
  priority?: number;
  size?: TFeaturePopupSize;
  delay?: number;
  duration?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TFeaturePopupResponse = TResponse<TFeaturePopup>;
export type TFeaturePopupsResponse = TResponse<TFeaturePopup[]>;
