import DashboardChartsSection from "@/components/(common)/dashboard/DashboardChartsSection";
import DashboardStatisticsSection from "@/components/(common)/dashboard/DashboardStatisticsSection";
import PageHeader from "@/components/sections/PageHeader";
import {
  fetchDashboardFeatures,
  fetchDashboardPackages,
  fetchDashboardPaymentMethods,
  fetchDashboardRevenue,
  fetchDashboardStatistics,
  fetchDashboardTokenFlow,
  fetchDashboardTransactions,
  fetchDashboardUserGrowth,
} from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const period = "30d";

  // Fetch dashboard statistics
  const { data: statisticsResponse, isLoading: statisticsLoading } = useQuery({
    queryKey: ["dashboard", "statistics"],
    queryFn: fetchDashboardStatistics,
  });

  // Fetch revenue data
  const { data: revenueResponse, isLoading: revenueLoading } = useQuery({
    queryKey: ["dashboard", "revenue", period],
    queryFn: () => fetchDashboardRevenue(period),
  });

  // Fetch transaction status data
  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useQuery({
      queryKey: ["dashboard", "transactions"],
      queryFn: fetchDashboardTransactions,
    });

  // Fetch payment methods data
  const { data: paymentMethodsResponse, isLoading: paymentMethodsLoading } =
    useQuery({
      queryKey: ["dashboard", "payment-methods"],
      queryFn: fetchDashboardPaymentMethods,
    });

  // Fetch token flow data
  const { data: tokenFlowResponse, isLoading: tokenFlowLoading } = useQuery({
    queryKey: ["dashboard", "token-flow", period],
    queryFn: () => fetchDashboardTokenFlow(period),
  });

  // Fetch user growth data
  const { data: userGrowthResponse, isLoading: userGrowthLoading } = useQuery({
    queryKey: ["dashboard", "user-growth", period],
    queryFn: () => fetchDashboardUserGrowth(period),
  });

  // Fetch packages data
  const { data: packagesResponse, isLoading: packagesLoading } = useQuery({
    queryKey: ["dashboard", "packages"],
    queryFn: fetchDashboardPackages,
  });

  // Fetch features data
  const { data: featuresResponse, isLoading: featuresLoading } = useQuery({
    queryKey: ["dashboard", "features"],
    queryFn: fetchDashboardFeatures,
  });

  console.log(featuresResponse);

  const isLoading =
    statisticsLoading ||
    revenueLoading ||
    transactionsLoading ||
    paymentMethodsLoading ||
    tokenFlowLoading ||
    userGrowthLoading ||
    packagesLoading ||
    featuresLoading;

  return (
    <main className="space-y-6">
      <PageHeader name="dashboard" />
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <DashboardStatisticsSection data={statisticsResponse?.data} />
          <DashboardChartsSection
            revenueData={revenueResponse?.data}
            transactionStatusData={transactionsResponse?.data}
            paymentMethodData={paymentMethodsResponse?.data}
            tokenFlowData={tokenFlowResponse?.data}
            userGrowthData={userGrowthResponse?.data}
            packageData={packagesResponse?.data}
            featureData={featuresResponse?.data}
          />
        </>
      )}
    </main>
  );
};

export default Dashboard;
