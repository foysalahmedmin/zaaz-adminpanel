import api from '@/lib/api';
import type {
  TDashboardFeaturePerformance,
  TDashboardPackagePerformance,
  TDashboardPaymentMethod,
  TDashboardRevenueData,
  TDashboardStatistics,
  TDashboardTokenFlow,
  TDashboardTransactionStatus,
  TDashboardUserGrowth,
} from '@/types/dashboard.type';
import type { Response } from '@/types/response.type';

export const fetchDashboardStatistics = async (): Promise<
  Response<TDashboardStatistics>
> => {
  const response = await api.get('/api/dashboard/statistics');
  return response.data as Response<TDashboardStatistics>;
};

export const fetchDashboardRevenue = async (
  period: string = '30d',
): Promise<Response<TDashboardRevenueData>> => {
  const response = await api.get('/api/dashboard/revenue', {
    params: { period },
  });
  return response.data as Response<TDashboardRevenueData>;
};

export const fetchDashboardTransactions = async (): Promise<
  Response<TDashboardTransactionStatus>
> => {
  const response = await api.get('/api/dashboard/transactions');
  return response.data as Response<TDashboardTransactionStatus>;
};

export const fetchDashboardPaymentMethods = async (): Promise<
  Response<TDashboardPaymentMethod>
> => {
  const response = await api.get('/api/dashboard/payment-methods');
  return response.data as Response<TDashboardPaymentMethod>;
};

export const fetchDashboardTokenFlow = async (
  period: string = '30d',
): Promise<Response<TDashboardTokenFlow>> => {
  const response = await api.get('/api/dashboard/token-flow', {
    params: { period },
  });
  return response.data as Response<TDashboardTokenFlow>;
};

export const fetchDashboardUserGrowth = async (
  period: string = '30d',
): Promise<Response<TDashboardUserGrowth>> => {
  const response = await api.get('/api/dashboard/user-growth', {
    params: { period },
  });
  return response.data as Response<TDashboardUserGrowth>;
};

export const fetchDashboardPackages = async (): Promise<
  Response<TDashboardPackagePerformance>
> => {
  const response = await api.get('/api/dashboard/packages');
  return response.data as Response<TDashboardPackagePerformance>;
};

export const fetchDashboardFeatures = async (): Promise<
  Response<TDashboardFeaturePerformance>
> => {
  const response = await api.get('/api/dashboard/features');
  return response.data as Response<TDashboardFeaturePerformance>;
};

