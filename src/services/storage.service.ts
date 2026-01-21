import api from "@/lib/api";
import type { TStoragesResponse } from "@/types/storage.type";

// POST Upload Files (Admin)
export async function uploadFiles(
  payload: FormData
): Promise<TStoragesResponse> {
  const response = await api.post("/api/storage/upload", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as TStoragesResponse;
}
