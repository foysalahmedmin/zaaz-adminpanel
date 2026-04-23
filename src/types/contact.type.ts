import type { TResponse } from "./response.type";

export type TContact = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TContactResponse = TResponse<TContact>;
export type TContactsResponse = TResponse<TContact[]>;
