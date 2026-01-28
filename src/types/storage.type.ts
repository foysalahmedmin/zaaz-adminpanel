import type { TResponse } from "./response.type";

export type TStorage = {
  _id: string;
  field_name: string;
  name: string;
  file_name: string;
  bucket: string;
  url?: string;
  path: string;
  size: number;
  mime_type: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
};

export type TStorageResponse = TResponse<TStorage>;
export type TStoragesResponse = TResponse<TStorage[]>;
