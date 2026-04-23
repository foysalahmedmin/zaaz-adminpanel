import RecycleBinFilterSection from "@/components/(common)/recycle-bin-page/RecycleBinFilterSection";
import RecycleBinStatisticsSection from "@/components/(common)/recycle-bin-page/RecycleBinStatisticsSection";
import RecycleBinTabsSection from "@/components/(common)/recycle-bin-page/RecycleBinTabsSection";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import {
  resetRecycleBinPageState,
  setActiveTab,
  setGte,
  setLimit,
  setLte,
  setPage,
  setSearch,
  setSort,
} from "@/redux/slices/recycle-bin-page-slice";
import type { RootState } from "@/redux/store";
import { fetchAiModels } from "@/services/ai-model.service";
import { fetchBillingSettings } from "@/services/billing-setting.service";
import { fetchContacts } from "@/services/contact.service";
import { fetchCreditsProfits } from "@/services/credits-profit.service";
import { fetchFeatureEndpoints } from "@/services/feature-endpoint.service";
import { fetchFeatures } from "@/services/feature.service";
import { fetchPackageTransactions } from "@/services/package-transaction.service";
import { fetchPackages } from "@/services/package.service";
import { fetchFiles } from "@/services/file.service";
import { fetchPaymentMethods } from "@/services/payment-method.service";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import { fetchPlans } from "@/services/plan.service";
import { fetchUsers } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const RecycleBinPage = () => {
  const dispatch = useDispatch();

  const { activeTab, page, limit, search, sort, gte, lte } = useSelector(
    (state: RootState) => state.recycleBinPage,
  );

  // Fetch deleted items for each module
  const { data: featuresData } = useQuery({
    queryKey: ["features", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchFeatures({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "feature",
  });

  const { data: featureEndpointsData } = useQuery({
    queryKey: [
      "feature-endpoints",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchFeatureEndpoints({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "feature-endpoint",
  });

  const { data: packagesData } = useQuery({
    queryKey: ["packages", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchPackages({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "package",
  });

  const { data: creditsProfitsData } = useQuery({
    queryKey: [
      "credits-profits",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchCreditsProfits({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "credits-profit",
  });

  const { data: usersData } = useQuery({
    queryKey: ["users", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchUsers({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "user",
  });

  const { data: packageTransactionsData } = useQuery({
    queryKey: [
      "package-transactions",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchPackageTransactions({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "package-transaction",
  });

  const { data: aiModelsData } = useQuery({
    queryKey: ["ai-models", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchAiModels({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "ai-model",
  });

  const { data: intervalsData } = useQuery({
    queryKey: ["intervals", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchPlans({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "interval",
  });

  const { data: paymentMethodsData } = useQuery({
    queryKey: [
      "payment-methods",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchPaymentMethods({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "payment-method",
  });

  const { data: paymentTransactionsData } = useQuery({
    queryKey: [
      "payment-transactions",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchPaymentTransactions({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "payment-transaction",
  });

  const { data: billingSettingsData } = useQuery({
    queryKey: [
      "billing-settings",
      "deleted",
      { page, limit, search, sort, gte, lte },
    ],
    queryFn: () =>
      fetchBillingSettings({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "billing-setting",
  });

  const { data: contactsData } = useQuery({
    queryKey: ["contacts", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchContacts({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "contact",
  });

  const { data: filesData } = useQuery({
    queryKey: ["files", "deleted", { page, limit, search, sort, gte, lte }],
    queryFn: () =>
      fetchFiles({
        is_deleted: true,
        page,
        limit,
        sort: sort || "-created_at",
        ...(search && { search }),
        ...(gte && { gte }),
        ...(lte && { lte }),
      }),
    enabled: activeTab === "file",
  });

  // Aggregate statistics
  const statistics = {
    features: featuresData?.meta?.total || 0,
    featureEndpoints: featureEndpointsData?.meta?.total || 0,
    packages: packagesData?.meta?.total || 0,
    creditsProfits: creditsProfitsData?.meta?.total || 0,
    users: usersData?.meta?.total || 0,
    packageTransactions: packageTransactionsData?.meta?.total || 0,
    aiModels: aiModelsData?.meta?.total || 0,
    intervals: intervalsData?.meta?.total || 0,
    paymentMethods: paymentMethodsData?.meta?.total || 0,
    paymentTransactions: paymentTransactionsData?.meta?.total || 0,
    billingSettings: billingSettingsData?.meta?.total || 0,
    contacts: contactsData?.meta?.total || 0,
    files: filesData?.meta?.total || 0,
  };

  const totalDeleted = Object.values(statistics).reduce(
    (sum, count) => sum + count,
    0,
  );

  return (
    <main className="space-y-6">
      <PageHeader
        name="Recycle Bin"
        description="Manage soft-deleted items. Restore or permanently delete them."
        slot={<Trash2 className="h-5 w-5" />}
      />

      <RecycleBinFilterSection
        gte={gte}
        setGte={(val: string) => dispatch(setGte(val))}
        lte={lte}
        setLte={(val: string) => dispatch(setLte(val))}
        onReset={() => dispatch(resetRecycleBinPageState())}
      />
      <RecycleBinStatisticsSection
        statistics={statistics}
        total={totalDeleted}
      />
      <Card>
        <Card.Header className="border-b">
          <h2 className="text-foreground text-xl font-semibold">
            Deleted Items
          </h2>
        </Card.Header>
        <Card.Content className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              dispatch(
                setActiveTab(
                  value as
                    | "feature"
                    | "feature-endpoint"
                    | "package"
                    | "credits-profit"
                    | "user"
                    | "package-transaction"
                    | "ai-model"
                    | "interval"
                    | "payment-method"
                    | "payment-transaction"
                    | "billing-setting"
                    | "contact"
                    | "file",
                ),
              )
            }
          >
            <Tabs.List>
              <Tabs.Trigger value="feature">
                Features ({statistics.features})
              </Tabs.Trigger>
              <Tabs.Trigger value="feature-endpoint">
                Feature Endpoints ({statistics.featureEndpoints})
              </Tabs.Trigger>
              <Tabs.Trigger value="package">
                Packages ({statistics.packages})
              </Tabs.Trigger>
              <Tabs.Trigger value="credits-profit">
                Credits Profits ({statistics.creditsProfits})
              </Tabs.Trigger>
              <Tabs.Trigger value="user">
                Users ({statistics.users})
              </Tabs.Trigger>
              <Tabs.Trigger value="package-transaction">
                Package Transactions ({statistics.packageTransactions})
              </Tabs.Trigger>
              <Tabs.Trigger value="ai-model">
                AI Models ({statistics.aiModels})
              </Tabs.Trigger>
              <Tabs.Trigger value="interval">
                Intervals ({statistics.intervals})
              </Tabs.Trigger>
              <Tabs.Trigger value="payment-method">
                Payment Methods ({statistics.paymentMethods})
              </Tabs.Trigger>
              <Tabs.Trigger value="payment-transaction">
                Payment Transactions ({statistics.paymentTransactions})
              </Tabs.Trigger>
              <Tabs.Trigger value="billing-setting">
                Billing Settings ({statistics.billingSettings})
              </Tabs.Trigger>
              <Tabs.Trigger value="contact">
                Contacts ({statistics.contacts})
              </Tabs.Trigger>
              <Tabs.Trigger value="file">
                Files ({statistics.files})
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content>
              <Tabs.Item value="feature">
                <RecycleBinTabsSection
                  type="feature"
                  data={featuresData?.data || []}
                  meta={
                    featuresData?.meta
                      ? {
                          total: featuresData.meta.total || 0,
                          page: featuresData.meta.page || 1,
                          limit: featuresData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: featuresData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="feature-endpoint">
                <RecycleBinTabsSection
                  type="feature-endpoint"
                  data={featureEndpointsData?.data || []}
                  meta={
                    featureEndpointsData?.meta
                      ? {
                          total: featureEndpointsData.meta.total || 0,
                          page: featureEndpointsData.meta.page || 1,
                          limit: featureEndpointsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: featureEndpointsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="package">
                <RecycleBinTabsSection
                  type="package"
                  data={packagesData?.data || []}
                  meta={
                    packagesData?.meta
                      ? {
                          total: packagesData.meta.total || 0,
                          page: packagesData.meta.page || 1,
                          limit: packagesData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: packagesData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="credits-profit">
                <RecycleBinTabsSection
                  type="credits-profit"
                  data={creditsProfitsData?.data || []}
                  meta={
                    creditsProfitsData?.meta
                      ? {
                          total: creditsProfitsData.meta.total || 0,
                          page: creditsProfitsData.meta.page || 1,
                          limit: creditsProfitsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: creditsProfitsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="user">
                <RecycleBinTabsSection
                  type="user"
                  data={usersData?.data || []}
                  meta={
                    usersData?.meta
                      ? {
                          total: usersData.meta.total || 0,
                          page: usersData.meta.page || 1,
                          limit: usersData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: usersData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="package-transaction">
                <RecycleBinTabsSection
                  type="package-transaction"
                  data={packageTransactionsData?.data || []}
                  meta={
                    packageTransactionsData?.meta
                      ? {
                          total: packageTransactionsData.meta.total || 0,
                          page: packageTransactionsData.meta.page || 1,
                          limit: packageTransactionsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: packageTransactionsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="ai-model">
                <RecycleBinTabsSection
                  type="ai-model"
                  data={aiModelsData?.data || []}
                  meta={
                    aiModelsData?.meta
                      ? {
                          total: aiModelsData.meta.total || 0,
                          page: aiModelsData.meta.page || 1,
                          limit: aiModelsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: aiModelsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="interval">
                <RecycleBinTabsSection
                  type="interval"
                  data={intervalsData?.data || []}
                  meta={
                    intervalsData?.meta
                      ? {
                          total: intervalsData.meta.total || 0,
                          page: intervalsData.meta.page || 1,
                          limit: intervalsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: intervalsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="payment-method">
                <RecycleBinTabsSection
                  type="payment-method"
                  data={paymentMethodsData?.data || []}
                  meta={
                    paymentMethodsData?.meta
                      ? {
                          total: paymentMethodsData.meta.total || 0,
                          page: paymentMethodsData.meta.page || 1,
                          limit: paymentMethodsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: paymentMethodsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="payment-transaction">
                <RecycleBinTabsSection
                  type="payment-transaction"
                  data={paymentTransactionsData?.data || []}
                  meta={
                    paymentTransactionsData?.meta
                      ? {
                          total: paymentTransactionsData.meta.total || 0,
                          page: paymentTransactionsData.meta.page || 1,
                          limit: paymentTransactionsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: paymentTransactionsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="billing-setting">
                <RecycleBinTabsSection
                  type="billing-setting"
                  data={billingSettingsData?.data || []}
                  meta={
                    billingSettingsData?.meta
                      ? {
                          total: billingSettingsData.meta.total || 0,
                          page: billingSettingsData.meta.page || 1,
                          limit: billingSettingsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: billingSettingsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="contact">
                <RecycleBinTabsSection
                  type="contact"
                  data={contactsData?.data || []}
                  meta={
                    contactsData?.meta
                      ? {
                          total: contactsData.meta.total || 0,
                          page: contactsData.meta.page || 1,
                          limit: contactsData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: contactsData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
              <Tabs.Item value="file">
                <RecycleBinTabsSection
                  type="file"
                  data={filesData?.data || []}
                  meta={
                    filesData?.meta
                      ? {
                          total: filesData.meta.total || 0,
                          page: filesData.meta.page || 1,
                          limit: filesData.meta.limit || 10,
                        }
                      : undefined
                  }
                  isLoading={false}
                  isError={false}
                  state={{
                    total: filesData?.meta?.total || 0,
                    page,
                    setPage: (value: number) => dispatch(setPage(value)),
                    limit,
                    setLimit: (value: number) => dispatch(setLimit(value)),
                    search,
                    setSearch: (value: string) => dispatch(setSearch(value)),
                    sort,
                    setSort: (value: string) => dispatch(setSort(value)),
                  }}
                />
              </Tabs.Item>
            </Tabs.Content>
          </Tabs>
        </Card.Content>
      </Card>
    </main>
  );
};

export default RecycleBinPage;
