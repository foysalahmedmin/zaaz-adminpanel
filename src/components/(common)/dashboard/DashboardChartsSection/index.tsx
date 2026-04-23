"use client";

import { Card } from "@/components/ui/Card";
import type {
  TDashboardAiModelUsage,
  TDashboardCreditsFlow,
  TDashboardFeaturePerformance,
  TDashboardPackageAssignments,
  TDashboardPackagePerformance,
  TDashboardPaymentMethod,
  TDashboardRevenueData,
  TDashboardTransactionStatus,
  TDashboardUserGrowth,
} from "@/types/dashboard.type";
import React from "react";
import AiModelUsageChart from "../charts/AiModelUsageChart";
import CreditsFlowChart from "../charts/CreditsFlowChart";
import FeaturePerformanceChart from "../charts/FeaturePerformanceChart";
import PackageAssignmentsChart from "../charts/PackageAssignmentsChart";
import PackagePerformanceChart from "../charts/PackagePerformanceChart";
import PaymentMethodChart from "../charts/PaymentMethodChart";
import RevenueChart from "../charts/RevenueChart";
import TransactionStatusChart from "../charts/TransactionStatusChart";
import UserGrowthChart from "../charts/UserGrowthChart";

type DashboardChartsSectionProps = {
  period: string;
  revenueData?: TDashboardRevenueData;
  transactionStatusData?: TDashboardTransactionStatus;
  paymentMethodData?: TDashboardPaymentMethod;
  creditsFlowData?: TDashboardCreditsFlow;
  userGrowthData?: TDashboardUserGrowth;
  packageData?: TDashboardPackagePerformance;
  featureData?: TDashboardFeaturePerformance;
  aiModelData?: TDashboardAiModelUsage;
  packageAssignmentsData?: TDashboardPackageAssignments;
};

const periodLabel: Record<string, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "1y": "1 year",
};

const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({
  period,
  revenueData,
  transactionStatusData,
  paymentMethodData,
  creditsFlowData,
  userGrowthData,
  packageData,
  featureData,
  aiModelData,
  packageAssignmentsData,
}) => {
  const pLabel = periodLabel[period] ?? period;

  return (
    <div className="space-y-6">
      {/* ── Revenue (full width) ─────────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Revenue Trend</Card.Title>
          <p className="text-muted-foreground text-sm">
            Daily revenue over the last {pLabel} (USD & BDT)
          </p>
        </Card.Header>
        <Card.Content>
          <RevenueChart data={revenueData} />
        </Card.Content>
      </Card>

      {/* ── Growth side-by-side ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>User Growth</Card.Title>
            <p className="text-muted-foreground text-sm">
              New registrations over the last {pLabel}
            </p>
          </Card.Header>
          <Card.Content>
            <UserGrowthChart data={userGrowthData} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Package Assignments</Card.Title>
            <p className="text-muted-foreground text-sm">
              Package subscriptions over the last {pLabel}
            </p>
          </Card.Header>
          <Card.Content>
            <PackageAssignmentsChart data={packageAssignmentsData} />
          </Card.Content>
        </Card>
      </div>

      {/* ── Credits Flow (full width) ────────────────────────── */}
      <Card>
        <Card.Header>
          <Card.Title>Credits Flow</Card.Title>
          <p className="text-muted-foreground text-sm">
            Daily credits earned vs consumed over the last {pLabel}
          </p>
        </Card.Header>
        <Card.Content>
          <CreditsFlowChart data={creditsFlowData} />
        </Card.Content>
      </Card>

      {/* ── Financial breakdown ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Transaction Status</Card.Title>
            <p className="text-muted-foreground text-sm">
              Distribution of all payment transactions by status
            </p>
          </Card.Header>
          <Card.Content>
            <TransactionStatusChart data={transactionStatusData} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Payment Methods</Card.Title>
            <p className="text-muted-foreground text-sm">
              Transaction volume and revenue by gateway
            </p>
          </Card.Header>
          <Card.Content>
            <PaymentMethodChart data={paymentMethodData} />
          </Card.Content>
        </Card>
      </div>

      {/* ── Platform performance ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Feature Performance</Card.Title>
            <p className="text-muted-foreground text-sm">
              Top 10 features by usage (calls & credits spent)
            </p>
          </Card.Header>
          <Card.Content>
            <FeaturePerformanceChart data={featureData} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>AI Model Usage</Card.Title>
            <p className="text-muted-foreground text-sm">
              API calls and credits charged per AI model
            </p>
          </Card.Header>
          <Card.Content>
            <AiModelUsageChart data={aiModelData} />
          </Card.Content>
        </Card>
      </div>

      {/* ── Package revenue ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Package Revenue</Card.Title>
            <p className="text-muted-foreground text-sm">
              Purchase count and revenue per package (paid transactions)
            </p>
          </Card.Header>
          <Card.Content>
            <PackagePerformanceChart data={packageData} />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default DashboardChartsSection;
