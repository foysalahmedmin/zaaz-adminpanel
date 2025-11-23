"use client";

import { Card } from "@/components/ui/Card";
import type {
  TDashboardFeaturePerformance,
  TDashboardPackagePerformance,
  TDashboardPaymentMethod,
  TDashboardRevenueData,
  TDashboardTokenFlow,
  TDashboardTransactionStatus,
  TDashboardUserGrowth,
} from "@/types/dashboard.type";
import React from "react";
import FeaturePerformanceChart from "../charts/FeaturePerformanceChart";
import PackagePerformanceChart from "../charts/PackagePerformanceChart";
import PaymentMethodChart from "../charts/PaymentMethodChart";
import RevenueChart from "../charts/RevenueChart";
import TokenFlowChart from "../charts/TokenFlowChart";
import TransactionStatusChart from "../charts/TransactionStatusChart";
import UserGrowthChart from "../charts/UserGrowthChart";

type DashboardChartsSectionProps = {
  revenueData?: TDashboardRevenueData;
  transactionStatusData?: TDashboardTransactionStatus;
  paymentMethodData?: TDashboardPaymentMethod;
  tokenFlowData?: TDashboardTokenFlow;
  userGrowthData?: TDashboardUserGrowth;
  packageData?: TDashboardPackagePerformance;
  featureData?: TDashboardFeaturePerformance;
};

const DashboardChartsSection: React.FC<DashboardChartsSectionProps> = ({
  revenueData,
  transactionStatusData,
  paymentMethodData,
  tokenFlowData,
  userGrowthData,
  packageData,
  featureData,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Revenue Trend Chart - Full Width */}
      <Card className="col-span-1 lg:col-span-2">
        <Card.Header>
          <Card.Title>Revenue Trend</Card.Title>
          <p>Daily revenue over the last 30 days (USD & BDT)</p>
        </Card.Header>
        <Card.Content>
          <RevenueChart data={revenueData} />
        </Card.Content>
      </Card>

      {/* Feature Performance Chart - Full Width */}
      <Card className="col-span-1 lg:col-span-2">
        <Card.Header>
          <Card.Title>Feature Performance</Card.Title>
          <p>Top features by usage count (based on token transactions)</p>
        </Card.Header>
        <Card.Content>
          <FeaturePerformanceChart data={featureData} />
        </Card.Content>
      </Card>

      {/* Transaction Status Distribution */}
      <Card>
        <Card.Header>
          <Card.Title>Transaction Status</Card.Title>
          <p>Distribution of transactions by status</p>
        </Card.Header>
        <Card.Content>
          <TransactionStatusChart data={transactionStatusData} />
        </Card.Content>
      </Card>

      {/* Payment Method Performance */}
      <Card>
        <Card.Header>
          <Card.Title>Payment Methods</Card.Title>
          <p>Transaction count by payment method</p>
        </Card.Header>
        <Card.Content>
          <PaymentMethodChart data={paymentMethodData} />
        </Card.Content>
      </Card>

      {/* Token Flow Chart */}
      <Card>
        <Card.Header>
          <Card.Title>Token Flow</Card.Title>
          <p>Daily token increases vs decreases</p>
        </Card.Header>
        <Card.Content>
          <TokenFlowChart data={tokenFlowData} />
        </Card.Content>
      </Card>

      {/* User Growth Chart */}
      <Card>
        <Card.Header>
          <Card.Title>User Growth</Card.Title>
          <p>Daily new user registrations</p>
        </Card.Header>
        <Card.Content>
          <UserGrowthChart data={userGrowthData} />
        </Card.Content>
      </Card>

      {/* Package Sales Performance */}
      <Card>
        <Card.Header>
          <Card.Title>Package Performance</Card.Title>
          <p>Purchase count per package</p>
        </Card.Header>
        <Card.Content>
          <PackagePerformanceChart data={packageData} />
        </Card.Content>
      </Card>
    </div>
  );
};

export default DashboardChartsSection;
