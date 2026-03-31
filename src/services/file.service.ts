import api from "@/lib/api";
import type { TFilesResponse } from "@/types/file.type";

// POST Upload Files (Admin)
export async function uploadFiles(
  payload: FormData
): Promise<TFilesResponse> {
  const response = await api.post("/api/files/cloud", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as TFilesResponse;
}
