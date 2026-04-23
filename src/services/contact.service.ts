import api from "@/lib/api";
import type { TContactResponse, TContactsResponse } from "@/types/contact.type";

export async function fetchContacts(
  query?: Record<string, unknown>,
): Promise<TContactsResponse> {
  const response = await api.get("/api/contacts", { params: query });
  return response.data as TContactsResponse;
}

export async function fetchContact(id: string): Promise<TContactResponse> {
  const response = await api.get(`/api/contacts/${id}`);
  return response.data as TContactResponse;
}

export async function deleteContact(id: string): Promise<TContactResponse> {
  const response = await api.delete(`/api/contacts/${id}`);
  return response.data as TContactResponse;
}

export async function deleteContactPermanent(id: string): Promise<TContactResponse> {
  const response = await api.delete(`/api/contacts/${id}/permanent`);
  return response.data as TContactResponse;
}

export async function restoreContact(id: string): Promise<TContactResponse> {
  const response = await api.post(`/api/contacts/${id}/restore`);
  return response.data as TContactResponse;
}
