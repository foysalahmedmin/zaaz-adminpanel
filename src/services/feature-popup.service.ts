import api from "@/lib/api";
import type {
    TFeaturePopup,
    TFeaturePopupResponse,
    TFeaturePopupsResponse,
} from "@/types/feature-popup.type";

// GET All Feature Popups (Admin)
export async function fetchFeaturePopups(
  query?: Record<string, unknown>,
): Promise<TFeaturePopupsResponse> {
  const response = await api.get("/api/feature-popups", { params: query });
  return response.data as TFeaturePopupsResponse;
}

// GET Single Feature Popup by ID (Admin)
export async function fetchFeaturePopup(
  id: string,
): Promise<TFeaturePopupResponse> {
  const response = await api.get(`/api/feature-popups/${id}`);
  return response.data as TFeaturePopupResponse;
}

// POST Create Feature Popup (Admin) - FormData with files
export async function createFeaturePopup(
  payload: Partial<TFeaturePopup> & {
    image?: File | null;
    video?: File | null;
  },
): Promise<TFeaturePopupResponse> {
  const formData = new FormData();

  // Append text fields
  formData.append("feature", payload.feature as string);
  formData.append("name", payload.name || "");
  formData.append("value", payload.value || "");
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.content) {
    formData.append("content", payload.content);
  }
  if (payload.actions) {
    formData.append("actions", JSON.stringify(payload.actions));
  }
  if (payload.category) {
    formData.append("category", payload.category);
  }
  if (payload.is_active !== undefined) {
    formData.append("is_active", String(payload.is_active));
  }

  // Append files
  if (payload.image !== undefined) {
    formData.append("image", payload.image === null ? "" : payload.image);
  }
  if (payload.video !== undefined) {
    formData.append("video", payload.video === null ? "" : payload.video);
  }

  const response = await api.post("/api/feature-popups", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as TFeaturePopupResponse;
}

// PATCH Update Feature Popup (Admin) - FormData with files
export async function updateFeaturePopup(
  id: string,
  payload: Partial<TFeaturePopup> & {
    image?: File | null;
    video?: File | null;
  },
): Promise<TFeaturePopupResponse> {
  const formData = new FormData();

  // Append text fields
  if (payload.feature) {
    formData.append("feature", payload.feature as string);
  }
  if (payload.name) {
    formData.append("name", payload.name);
  }
  if (payload.value) {
    formData.append("value", payload.value);
  }
  if (payload.description !== undefined) {
    formData.append("description", payload.description || "");
  }
  if (payload.content !== undefined) {
    formData.append("content", payload.content || "");
  }
  if (payload.actions !== undefined) {
    formData.append("actions", JSON.stringify(payload.actions));
  }
  if (payload.category) {
    formData.append("category", payload.category);
  }
  if (payload.is_active !== undefined) {
    formData.append("is_active", String(payload.is_active));
  }

  // Append files
  if (payload.image !== undefined) {
    formData.append("image", payload.image === null ? "" : payload.image);
  }
  if (payload.video !== undefined) {
    formData.append("video", payload.video === null ? "" : payload.video);
  }

  // Note: Old file deletion is handled by the backend service
  // The backend automatically detects when new files are uploaded
  // and deletes the corresponding old files from cloud storage

  const response = await api.patch(`/api/feature-popups/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data as TFeaturePopupResponse;
}

// DELETE Single Feature Popup (Admin)
export async function deleteFeaturePopup(
  id: string,
): Promise<TFeaturePopupResponse> {
  const response = await api.delete(`/api/feature-popups/${id}`);
  return response.data as TFeaturePopupResponse;
}

// DELETE Bulk Feature Popups (Admin)
export async function deleteFeaturePopups(payload: {
  ids: string[];
}): Promise<TFeaturePopupsResponse> {
  const response = await api.delete("/api/feature-popups/bulk", {
    data: payload,
  });
  return response.data as TFeaturePopupsResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteFeaturePopupPermanent(
  id: string,
): Promise<TFeaturePopupResponse> {
  const response = await api.delete(`/api/feature-popups/${id}/permanent`);
  return response.data as TFeaturePopupResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteFeaturePopupsPermanent(payload: {
  ids: string[];
}): Promise<TFeaturePopupsResponse> {
  const response = await api.delete("/api/feature-popups/bulk/permanent", {
    data: payload,
  });
  return response.data as TFeaturePopupsResponse;
}

// POST Single Restore (Admin)
export async function restoreFeaturePopup(
  id: string,
): Promise<TFeaturePopupResponse> {
  const response = await api.post(`/api/feature-popups/${id}/restore`);
  return response.data as TFeaturePopupResponse;
}

// POST Bulk Restore (Admin)
export async function restoreFeaturePopups(payload: {
  ids: string[];
}): Promise<TFeaturePopupsResponse> {
  const response = await api.post("/api/feature-popups/bulk/restore", payload);
  return response.data as TFeaturePopupsResponse;
}

