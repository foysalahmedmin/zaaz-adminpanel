import PackageHistoriesDataTableSection from "@/components/(common)/packages-details-page/PackageHistoriesDataTableSection";
import PackageHistoryViewModal from "@/components/modals/PackageHistoryViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  closeHistoryModal,
  openHistoryModal,
} from "@/redux/slices/packages-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPackageHistories } from "@/services/package-history.service";
import { fetchPackage } from "@/services/package.service";
import type { TPackage } from "@/types/package.type";
import type { TErrorResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  History,
  Package,
  Settings,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const PackagesDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const packageData = (location.state as { package?: TPackage })?.package;

  const { isHistoryModalOpen, selectedPackage } = useSelector(
    (state: RootState) => state.packagesPage,
  );

  const onOpenHistoryModal = () => {
    dispatch(openHistoryModal(selectedPackage || ({} as any)));
  };

  const {
    data: packageResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackage(id || ""),
    enabled: !!id,
  });

  const { data: historiesData, isLoading: historiesLoading } = useQuery({
    queryKey: ["package-histories", id],
    queryFn: () => fetchPackageHistories(id || ""),
    enabled: !!id,
  });

  const currentPackage = packageResponse?.data || packageData;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading package</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<TErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentPackage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Package not found</h2>
        </div>
      </div>
    );
  }

  const initialPlan = currentPackage.plans?.find((pp) => pp.is_initial);

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Package Details"
          description="View package information and plans"
          slot={<Package />}
        />

        {/* Package Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Package Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="border-border bg-primary/10 text-primary flex h-24 w-24 items-center justify-center rounded-full border-4">
                    <Package className="h-12 w-12" />
                  </div>
                  {currentPackage.is_active && (
                    <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      {currentPackage.name}
                    </h3>
                    {currentPackage.description && (
                      <p className="text-muted-foreground mt-1">
                        {currentPackage.description}
                      </p>
                    )}
                    <p className="text-muted-foreground mt-1 font-mono text-sm font-semibold uppercase">
                      Value: {currentPackage.value}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {currentPackage.badge && (
                      <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                        {currentPackage.badge}
                      </span>
                    )}
                    {currentPackage.type && (
                      <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm capitalize">
                        {currentPackage.type}
                      </span>
                    )}
                    <span
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium capitalize",
                        currentPackage.is_active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      )}
                    >
                      {currentPackage.is_active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {currentPackage.is_active ? "Active" : "Inactive"}
                    </span>
                    {initialPlan && (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        Initial Plan:{" "}
                        {initialPlan.price.USD > 0
                          ? `$${initialPlan.price.USD}`
                          : `৳${initialPlan.price.BDT}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Package Details Card */}
        <Card>
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Package Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Package ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentPackage._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Name</div>
                  <div className="text-foreground text-sm font-semibold">
                    {currentPackage.name}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Value
                  </div>
                  <div className="text-foreground text-sm font-bold uppercase">
                    {currentPackage.value}
                  </div>
                </div>
                {currentPackage.type && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Type
                    </div>
                    <div className="text-foreground text-sm capitalize">
                      {currentPackage.type}
                    </div>
                  </div>
                )}
                {currentPackage.sequence !== undefined && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Sequence
                    </div>
                    <div className="text-foreground text-sm">
                      {currentPackage.sequence}
                    </div>
                  </div>
                )}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Status
                  </div>
                  <div className="text-foreground text-sm capitalize">
                    {currentPackage.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                {currentPackage.plans && currentPackage.plans.length > 0 && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Total Plans
                    </div>
                    <div className="text-foreground text-xl font-bold">
                      {currentPackage.plans.length}
                    </div>
                  </div>
                )}
                {currentPackage.created_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Created At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentPackage.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentPackage.updated_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Updated At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentPackage.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Points */}
            {currentPackage.points && currentPackage.points.length > 0 && (
              <div>
                <h3 className="text-foreground mb-3 text-lg font-semibold">
                  Key Points
                </h3>
                <ul className="list-inside list-disc space-y-2">
                  {currentPackage.points.map((point: string, index: number) => (
                    <li key={index} className="text-muted-foreground text-sm">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features Section */}
            {currentPackage.features && currentPackage.features.length > 0 && (
              <div>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Accessible Features
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentPackage.features.map(
                    (feature: any, index: number) => {
                      // Handle both object (populated) and string (ID) cases
                      const featureName =
                        typeof feature === "object" && feature !== null
                          ? feature.name
                          : "N/A";
                      const featureDescription =
                        typeof feature === "object" && feature !== null
                          ? feature.description
                          : null;
                      const featureType =
                        typeof feature === "object" && feature !== null
                          ? feature.type
                          : null;
                      const featureId =
                        typeof feature === "object" && feature !== null
                          ? feature._id
                          : feature;
                      const isActive =
                        typeof feature === "object" && feature !== null
                          ? feature.is_active !== false
                          : true;

                      return (
                        <div
                          key={featureId || index}
                          className={cn(
                            "rounded-lg border p-4 transition-colors",
                            isActive
                              ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/20"
                              : "border-gray-200 bg-gray-50/50 dark:bg-gray-950/20",
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary flex-shrink-0 rounded-full p-2">
                              <Settings className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <p className="text-base font-semibold">
                                  {featureName}
                                </p>
                                {!isActive && (
                                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {featureDescription && (
                                <p className="text-muted-foreground line-clamp-2 text-sm">
                                  {featureDescription}
                                </p>
                              )}
                              {featureType && (
                                <span className="mt-2 inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 capitalize dark:bg-purple-900 dark:text-purple-200">
                                  {featureType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            {/* Plans Section */}
            {currentPackage.plans && currentPackage.plans.length > 0 && (
              <div>
                <h3 className="text-foreground mb-4 text-lg font-semibold">
                  Package Plans
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {currentPackage.plans.map((pp: any, index: number) => {
                    const plan = pp.plan;
                    const planName =
                      typeof plan === "object" && plan?.name
                        ? plan.name
                        : "N/A";
                    const planDuration =
                      typeof plan === "object" && plan?.duration
                        ? plan.duration
                        : 0;
                    return (
                      <div
                        key={pp._id || index}
                        className={cn(
                          "rounded-lg border p-4 transition-colors",
                          pp.is_active
                            ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
                            : "border-gray-200 bg-gray-50/50 dark:bg-gray-950/20",
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <p className="text-lg font-semibold">
                                {planName}
                              </p>
                              {pp.is_initial && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Initial
                                </span>
                              )}
                              {!pp.is_active && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3 text-sm">
                              Duration: {planDuration} days
                            </p>
                            <div className="space-y-1">
                              <p className="text-lg font-semibold">
                                ${pp.price?.USD || 0} / ৳{pp.price?.BDT || 0}
                              </p>
                              <p className="text-muted-foreground text-sm">
                                {pp.credits} credits
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* History Card */}
        <Card>
          <Card.Header className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-xl font-semibold">
                Package History
              </h2>
              <Button onClick={() => onOpenHistoryModal()} variant="outline">
                <History className="h-4 w-4" /> View All History
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <PackageHistoriesDataTableSection
              data={historiesData?.data || []}
              isLoading={historiesLoading}
              isError={false}
              onView={onOpenHistoryModal}
            />
          </Card.Content>
        </Card>

        {/* Modals */}
        <PackageHistoryViewModal
          packageId={id || ""}
          isOpen={isHistoryModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openHistoryModal(selectedPackage || ({} as any))
                : closeHistoryModal(),
            )
          }
        />
      </div>
    </div>
  );
};

export default PackagesDetailsPage;
