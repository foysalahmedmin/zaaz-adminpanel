import DashboardChartsSection from "@/components/(common)/dashboard/DashboardChartsSection";
import DashboardStatisticsSection from "@/components/(common)/dashboard/DashboardStatisticsSection";
import PageHeader from "@/components/sections/PageHeader";
import {
  fetchDashboardAiModels,
  fetchDashboardCreditsFlow,
  fetchDashboardFeatures,
  fetchDashboardPackageAssignments,
  fetchDashboardPackages,
  fetchDashboardPaymentMethods,
  fetchDashboardRevenue,
  fetchDashboardStatistics,
  fetchDashboardTransactions,
  fetchDashboardUserGrowth,
} from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Period = "7d" | "30d" | "90d" | "1y";

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "1y", label: "1Y" },
];

const SkeletonCard = () => (
  <div className="bg-card border-border animate-pulse rounded-xl border p-5">
    <div className="mb-3 flex items-center gap-2">
      <div className="bg-muted h-3 w-24 rounded" />
    </div>
    <div className="bg-muted mb-4 h-8 w-32 rounded" />
    <div className="bg-muted/60 h-px w-8 rounded-full" />
    <div className="mt-4 space-y-1.5">
      <div className="bg-muted h-3 w-28 rounded" />
      <div className="bg-muted h-3 w-40 rounded" />
    </div>
  </div>
);

const SkeletonChart = ({ wide = false }: { wide?: boolean }) => (
  <div
    className={`bg-card border-border animate-pulse rounded-xl border p-5 ${wide ? "col-span-full" : ""}`}
  >
    <div className="mb-1 h-4 w-36 rounded bg-muted" />
    <div className="mb-4 h-3 w-52 rounded bg-muted/60" />
    <div className="h-[316px] rounded bg-muted" />
  </div>
);

const Dashboard = () => {
  const [period, setPeriod] = useState<Period>("30d");

  const { data: statisticsResponse, isLoading: statisticsLoading } = useQuery({
    queryKey: ["dashboard", "statistics"],
    queryFn: fetchDashboardStatistics,
  });

  const { data: revenueResponse, isLoading: revenueLoading } = useQuery({
    queryKey: ["dashboard", "revenue", period],
    queryFn: () => fetchDashboardRevenue(period),
  });

  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useQuery({
      queryKey: ["dashboard", "transactions"],
      queryFn: fetchDashboardTransactions,
    });

  const { data: paymentMethodsResponse, isLoading: paymentMethodsLoading } =
    useQuery({
      queryKey: ["dashboard", "payment-methods"],
      queryFn: fetchDashboardPaymentMethods,
    });

  const { data: creditsFlowResponse, isLoading: creditsFlowLoading } = useQuery(
    {
      queryKey: ["dashboard", "credits-flow", period],
      queryFn: () => fetchDashboardCreditsFlow(period),
    },
  );

  const { data: userGrowthResponse, isLoading: userGrowthLoading } = useQuery({
    queryKey: ["dashboard", "user-growth", period],
    queryFn: () => fetchDashboardUserGrowth(period),
  });

  const { data: packagesResponse, isLoading: packagesLoading } = useQuery({
    queryKey: ["dashboard", "packages"],
    queryFn: fetchDashboardPackages,
  });

  const { data: featuresResponse, isLoading: featuresLoading } = useQuery({
    queryKey: ["dashboard", "features"],
    queryFn: fetchDashboardFeatures,
  });

  const { data: aiModelsResponse, isLoading: aiModelsLoading } = useQuery({
    queryKey: ["dashboard", "ai-models"],
    queryFn: fetchDashboardAiModels,
  });

  const {
    data: packageAssignmentsResponse,
    isLoading: packageAssignmentsLoading,
  } = useQuery({
    queryKey: ["dashboard", "package-assignments", period],
    queryFn: () => fetchDashboardPackageAssignments(period),
  });

  const chartsLoading =
    revenueLoading ||
    transactionsLoading ||
    paymentMethodsLoading ||
    creditsFlowLoading ||
    userGrowthLoading ||
    packagesLoading ||
    featuresLoading ||
    aiModelsLoading ||
    packageAssignmentsLoading;

  return (
    <main className="space-y-6">
      {/* Header + Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PageHeader name="dashboard" />
        <div className="bg-muted flex items-center gap-1 rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {statisticsLoading ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <DashboardStatisticsSection data={statisticsResponse?.data} />
      )}

      {/* Charts */}
      {chartsLoading ? (
        <div className="space-y-6">
          <SkeletonChart wide />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <SkeletonChart wide />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonChart />
            <SkeletonChart />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SkeletonChart />
          </div>
        </div>
      ) : (
        <DashboardChartsSection
          period={period}
          revenueData={revenueResponse?.data}
          transactionStatusData={transactionsResponse?.data}
          paymentMethodData={paymentMethodsResponse?.data}
          creditsFlowData={creditsFlowResponse?.data}
          userGrowthData={userGrowthResponse?.data}
          packageData={packagesResponse?.data}
          featureData={featuresResponse?.data}
          aiModelData={aiModelsResponse?.data}
          packageAssignmentsData={packageAssignmentsResponse?.data}
        />
      )}
    </main>
  );
};

export default Dashboard;
