import PackageHistoriesDataTableSection from "@/components/(common)/packages-details-page/PackageHistoriesDataTableSection";
import PackageHistoryViewModal from "@/components/modals/PackageHistoryViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  closeHistoryModal,
  openHistoryModal,
} from "@/redux/slices/packages-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPackageHistories } from "@/services/package-history.service";
import { fetchPackage } from "@/services/package.service";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const PackagesDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const packageData = (location.state as { package?: any })?.package;

  const { isHistoryModalOpen, selectedPackage } = useSelector(
    (state: RootState) => state.packagesPage,
  );

  const onOpenHistoryModal = () => {
    dispatch(openHistoryModal(selectedPackage || ({} as any)));
  };

  const { data: packageResponse } = useQuery({
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

  return (
    <main className="space-y-6">
      <PageHeader
        name={currentPackage?.name || "Package Details"}
        description={currentPackage?.description}
      />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Package Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {currentPackage?.name}
                </p>
                {currentPackage?.description && (
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {currentPackage?.description}
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {currentPackage?.is_active ? "Active" : "Inactive"}
                </p>
                {currentPackage?.plans && currentPackage.plans.length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium">Plans:</span>
                    <div className="mt-2 space-y-3">
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
                            className="rounded-lg border p-3"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {planName} ({planDuration} days)
                                </p>
                                {pp.is_initial && (
                                  <span className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                                    Initial Plan
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  ${pp.price?.USD || 0} / ৳{pp.price?.BDT || 0}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {pp.token} tokens
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header className="border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Package History</h2>
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
    </main>
  );
};

export default PackagesDetailsPage;
