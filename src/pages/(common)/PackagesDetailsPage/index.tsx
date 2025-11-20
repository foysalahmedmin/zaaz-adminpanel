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
                  <span className="font-medium">Tokens:</span>{" "}
                  {currentPackage?.token}
                </p>
                <p>
                  <span className="font-medium">Price (USD):</span> $
                  {currentPackage?.price?.USD || 0}
                </p>
                <p>
                  <span className="font-medium">Price (BDT):</span> ৳
                  {currentPackage?.price?.BDT || 0}
                </p>
                {currentPackage?.duration && (
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {currentPackage?.duration} days
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {currentPackage?.is_active ? "Active" : "Inactive"}
                </p>
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
