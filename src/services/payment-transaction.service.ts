import api from "@/lib/api";
import type {
  TInitiatePaymentResponseData,
  TPaymentTransaction,
  TPaymentTransactionResponse,
  TPaymentTransactionStatusResponse,
  TPaymentTransactionsResponse,
} from "@/types/payment-transaction.type";

// GET All Payment Transactions (Admin)
export async function fetchPaymentTransactions(
  query?: Record<string, unknown>,
): Promise<TPaymentTransactionsResponse> {
  const response = await api.get("/api/payment-transactions", {
    params: query,
  });
  return response.data as TPaymentTransactionsResponse;
}

// GET Self Payment Transactions (User/Admin)
export async function fetchSelfPaymentTransactions(
  query?: Record<string, unknown>,
): Promise<TPaymentTransactionsResponse> {
  const response = await api.get("/api/payment-transactions/self", {
    params: query,
  });
  return response.data as TPaymentTransactionsResponse;
}

// GET Single Payment Transaction by ID (Admin)
export async function fetchPaymentTransaction(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.get(`/api/payment-transactions/${id}`);
  return response.data as TPaymentTransactionResponse;
}

// GET Payment Transaction Status (User/Admin)
export async function fetchPaymentTransactionStatus(
  id: string,
): Promise<{ data: TPaymentTransactionStatusResponse }> {
  const response = await api.get(`/api/payment-transactions/${id}/status`);
  return { data: response.data.data as TPaymentTransactionStatusResponse };
}

// POST Create Payment (Admin direct create)
export async function createPaymentTransaction(
  payload: Partial<TPaymentTransaction>,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post("/api/payments", payload);
  return response.data as TPaymentTransactionResponse;
}

// POST Initiate Payment (User/Admin)
export async function initiatePayment(payload: {
  package: string;
  interval: string;
  payment_method: string;
  currency: string;
  return_url: string;
  cancel_url: string;
  customer_email?: string;
  customer_name?: string;
}): Promise<TInitiatePaymentResponseData> {
  const response = await api.post("/api/payments/initiate", payload);
  return response.data as TInitiatePaymentResponseData;
}

// POST Verify Payment (User/Admin)
export async function verifyPayment(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post(`/api/payments/${id}/verify`);
  return response.data as TPaymentTransactionResponse;
}

// PATCH Update Payment Status (Admin)
export async function updatePaymentTransaction(
  id: string,
  payload: Partial<TPaymentTransaction>,
): Promise<TPaymentTransactionResponse> {
  const response = await api.patch(`/api/payments/${id}`, payload);
  return response.data as TPaymentTransactionResponse;
}

// POST Initiate Refund (Admin)
export async function initiateRefund(
  id: string,
  admin_note?: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post(`/api/payments/${id}/refund`, { admin_note });
  return response.data as TPaymentTransactionResponse;
}

// POST Reconcile Pending Transactions (Admin)
export async function reconcilePayments(): Promise<{ message: string }> {
  const response = await api.post("/api/payments/reconcile");
  return response.data;
}

// DELETE Single Payment Transaction (Admin)
export async function deletePaymentTransaction(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.delete(`/api/payment-transactions/${id}`);
  return response.data as TPaymentTransactionResponse;
}

// DELETE Single Permanent (Admin)
export async function deletePaymentTransactionPermanent(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.delete(
    `/api/payment-transactions/${id}/permanent`,
  );
  return response.data as TPaymentTransactionResponse;
}

// POST Single Restore (Admin)
export async function restorePaymentTransaction(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post(
    `/api/payment-transactions/${id}/restore`,
  );
  return response.data as TPaymentTransactionResponse;
}
