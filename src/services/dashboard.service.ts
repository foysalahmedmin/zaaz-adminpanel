import api from "@/lib/api";
import type {
  TDashboardCreditsFlow,
  TDashboardFeaturePerformance,
  TDashboardPackagePerformance,
  TDashboardPaymentMethod,
  TDashboardRevenueData,
  TDashboardStatistics,
  TDashboardTransactionStatus,
  TDashboardUserGrowth,
} from "@/types/dashboard.type";
import type { TResponse } from "@/types/response.type";

export const fetchDashboardStatistics = async (): Promise<
  TResponse<TDashboardStatistics>
> => {
  const response = await api.get("/api/dashboard/statistics");
  return response.data as TResponse<TDashboardStatistics>;
};

export const fetchDashboardRevenue = async (
  period: string = "30d",
): Promise<TResponse<TDashboardRevenueData>> => {
  const response = await api.get("/api/dashboard/revenue", {
    params: { period },
  });
  return response.data as TResponse<TDashboardRevenueData>;
};

export const fetchDashboardTransactions = async (): Promise<
  TResponse<TDashboardTransactionStatus>
> => {
  const response = await api.get("/api/dashboard/transactions");
  return response.data as TResponse<TDashboardTransactionStatus>;
};

export const fetchDashboardPaymentMethods = async (): Promise<
  TResponse<TDashboardPaymentMethod>
> => {
  const response = await api.get("/api/dashboard/payment-methods");
  return response.data as TResponse<TDashboardPaymentMethod>;
};

export const fetchDashboardCreditsFlow = async (
  period: string = "30d",
): Promise<TResponse<TDashboardCreditsFlow>> => {
  const response = await api.get("/api/dashboard/credits-flow", {
    params: { period },
  });
  return response.data as TResponse<TDashboardCreditsFlow>;
};

export const fetchDashboardUserGrowth = async (
  period: string = "30d",
): Promise<TResponse<TDashboardUserGrowth>> => {
  const response = await api.get("/api/dashboard/user-growth", {
    params: { period },
  });
  return response.data as TResponse<TDashboardUserGrowth>;
};

export const fetchDashboardPackages = async (): Promise<
  TResponse<TDashboardPackagePerformance>
> => {
  const response = await api.get("/api/dashboard/packages");
  return response.data as TResponse<TDashboardPackagePerformance>;
};

export const fetchDashboardFeatures = async (): Promise<
  TResponse<TDashboardFeaturePerformance>
> => {
  const response = await api.get("/api/dashboard/features");
  return response.data as TResponse<TDashboardFeaturePerformance>;
};
