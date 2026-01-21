import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { fetchPackagePlans } from "@/services/package-plan.service";
import { fetchPackages } from "@/services/package.service";
import { assignPackage } from "@/services/user-wallet.service";
import type { TPackagePlan } from "@/types/package-plan.type";
import type { TPackage } from "@/types/package.type";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  Gift,
  Loader2,
  Package as PackageIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface AssignPackageModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  wallet: TUserWallet;
}

const AssignPackageModal = ({
  isOpen,
  setIsOpen,
  wallet,
}: AssignPackageModalProps) => {
  const queryClient = useQueryClient();
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [increaseSource, setIncreaseSource] = useState<"bonus" | "payment">(
    "bonus",
  );

  // Fetch Packages
  const { data: packagesData, isLoading: isPackagesLoading } = useQuery({
    queryKey: ["packages", { is_active: true }],
    queryFn: () => fetchPackages({ is_active: true }),
    enabled: isOpen,
  });

  // Fetch Package Plans (Filtered by selected package)
  const { data: packagePlansData, isLoading: isPlansLoading } = useQuery({
    queryKey: [
      "package-plans",
      { is_active: true, package: selectedPackageId },
    ],
    queryFn: () =>
      fetchPackagePlans({ is_active: true, package: selectedPackageId }),
    enabled: isOpen && !!selectedPackageId,
  });

  const packages = (packagesData?.data as TPackage[]) || [];

  const filteredPlans = (packagePlansData?.data as TPackagePlan[]) || [];

  // Find selected plan details
  const selectedPlanDetails = useMemo(() => {
    return filteredPlans.find((pp) => {
      const planId =
        typeof pp.plan === "string" ? pp.plan : (pp.plan as any)?._id;
      return planId === selectedPlanId;
    });
  }, [selectedPlanId, filteredPlans]);

  // Mutation
  const mutation = useMutation({
    mutationFn: assignPackage,
    onSuccess: (data) => {
      toast.success(data?.message || "Package assigned successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["user-wallets"] });
      queryClient.invalidateQueries({ queryKey: ["credits-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["package-transactions"] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign package");
    },
  });

  const resetForm = () => {
    setSelectedPackageId("");
    setSelectedPlanId("");
    setIncreaseSource("bonus");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackageId || !selectedPlanId) {
      toast.error("Please select both a package and a plan");
      return;
    }

    mutation.mutate({
      user_id: wallet.user as string,
      package_id: selectedPackageId,
      plan_id: selectedPlanId,
      increase_source: increaseSource,
      email: wallet.email,
    });
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      setIsOpen(false);
      resetForm();
    }
  };

  const isLoading = isPackagesLoading || isPlansLoading;

  return (
    <Modal isOpen={isOpen} setIsOpen={handleClose}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-md">
          <Modal.Header>
            <Modal.Title className="flex items-center gap-2">
              <PackageIcon className="text-primary h-5 w-5" />
              Assign Package
            </Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit}>
            <Modal.Body className="space-y-4">
              {/* User Info */}
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground text-sm">User</div>
                <div className="text-foreground font-semibold">
                  {wallet.email || "User"}
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <FormControl.Label>
                  Select Package <span className="text-red-500">*</span>
                </FormControl.Label>
                <FormControl
                  as="select"
                  value={selectedPackageId}
                  onChange={(e) => {
                    setSelectedPackageId(e.target.value);
                    setSelectedPlanId(""); // Reset plan when package changes
                  }}
                  disabled={mutation.isPending || isLoading}
                  required
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name}
                    </option>
                  ))}
                </FormControl>
              </div>

              {/* Plan Selection */}
              <div>
                <FormControl.Label>
                  Select Plan <span className="text-red-500">*</span>
                </FormControl.Label>
                <FormControl
                  as="select"
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  disabled={
                    mutation.isPending || isLoading || !selectedPackageId
                  }
                  required
                >
                  <option value="">Select a plan</option>
                  {filteredPlans.map((pp) => {
                    const planId =
                      typeof pp.plan === "string"
                        ? pp.plan
                        : (pp.plan as any)?._id;
                    const planName =
                      typeof pp.plan === "object"
                        ? (pp.plan as any)?.name
                        : "Standard Plan";
                    return (
                      <option key={planId} value={planId}>
                        {planName} ({pp.credits} credits)
                      </option>
                    );
                  })}
                </FormControl>
                {!selectedPackageId && (
                  <FormControl.Helper>
                    Please select a package first
                  </FormControl.Helper>
                )}
              </div>

              {/* Increase Source */}
              <div>
                <FormControl.Label>
                  Increase Source <span className="text-red-500">*</span>
                </FormControl.Label>
                <FormControl
                  as="select"
                  value={increaseSource}
                  onChange={(e) => setIncreaseSource(e.target.value as any)}
                  disabled={mutation.isPending}
                  required
                >
                  <option value="bonus">Bonus</option>
                  <option value="payment">Payment</option>
                </FormControl>
                <FormControl.Helper>
                  Was this package paid for or given as a bonus?
                </FormControl.Helper>
              </div>

              {/* Plan Summary */}
              {selectedPlanDetails && (
                <div className="bg-primary/10 border-primary/20 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Credits to add:
                    </span>
                    <span className="text-primary font-bold">
                      +{selectedPlanDetails.credits}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-sm">
                      New Total:
                    </span>
                    <span className="text-foreground font-semibold">
                      {(wallet.credits || 0) + selectedPlanDetails.credits}{" "}
                      credits
                    </span>
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending || !selectedPlanId}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    {increaseSource === "bonus" ? (
                      <Gift className="mr-2 h-4 w-4" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Assign Package
                  </>
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AssignPackageModal;
