import type { Response } from "./response.type";

export type TStatus = "active" | "inactive";

export type TEvent = {
  _id: string;
  icon?: string;
  thumbnail?: string;
  name: string;
  slug: string;
  description?: string;
  is_featured?: boolean;
  status: TStatus;
  layout?: "default" | "standard" | "featured" | "minimal";
  published_at?: string;
  expire_at?: string;
};

export type TEventCreatePayload = {
  icon?: string;
  thumbnail?: string;
  name: string;
  slug: string;
  description?: string;
  is_featured?: boolean;
  status: TStatus;
  layout?: "default" | "standard" | "featured" | "minimal";
  published_at?: string;
  expire_at?: string;
};

export type TEventUpdatePayload = {
  icon?: string;
  name?: string;
  slug?: string;
  description?: string;
  is_featured?: boolean;
  status?: TStatus;
  layout?: "default" | "standard" | "featured" | "minimal";
  published_at?: string;
  expire_at?: string;
};

export type TEventResponse = Response<TEvent>;
export type TEventsResponse = Response<TEvent[]>;
