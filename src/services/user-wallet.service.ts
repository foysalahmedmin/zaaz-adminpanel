import api from "@/lib/api";
import type {
  TUserWallet,
  TUserWalletResponse,
  TUserWalletsResponse,
} from "@/types/user-wallet.type";

// GET All User Wallets (Admin)
export async function fetchUserWallets(
  query?: Record<string, any>,
): Promise<TUserWalletsResponse> {
  const response = await api.get("/api/user-wallets", { params: query });
  return response.data as TUserWalletsResponse;
}

// GET Self Wallet (User/Admin)
export async function fetchSelfWallet(): Promise<TUserWalletResponse> {
  const response = await api.get("/api/user-wallets/self");
  return response.data as TUserWalletResponse;
}

// GET User Wallet by User ID (Admin)
export async function fetchUserWallet(
  userId: string,
): Promise<TUserWalletResponse> {
  const response = await api.get(`/api/user-wallets/user/${userId}`);
  return response.data as TUserWalletResponse;
}

// GET Single User Wallet by ID (Admin)
export async function fetchUserWalletById(
  id: string,
): Promise<TUserWalletResponse> {
  const response = await api.get(`/api/user-wallets/${id}`);
  return response.data as TUserWalletResponse;
}

// POST Create User Wallet (Admin)
export async function createUserWallet(
  payload: Partial<TUserWallet>,
): Promise<TUserWalletResponse> {
  const response = await api.post("/api/user-wallets", payload);
  return response.data as TUserWalletResponse;
}

// PATCH Update User Wallet (Admin)
export async function updateUserWallet(
  id: string,
  payload: Partial<TUserWallet>,
): Promise<TUserWalletResponse> {
  const response = await api.patch(`/api/user-wallets/${id}`, payload);
  return response.data as TUserWalletResponse;
}

// DELETE Single User Wallet (Admin)
export async function deleteUserWallet(
  id: string,
): Promise<TUserWalletResponse> {
  const response = await api.delete(`/api/user-wallets/${id}`);
  return response.data as TUserWalletResponse;
}

