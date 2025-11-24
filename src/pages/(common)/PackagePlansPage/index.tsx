import PackagePlansDataTableSection from "@/components/(common)/package-plans-page/PackagePlansDataTableSection";
import PackagePlansStatisticsSection from "@/components/(common)/package-plans-page/PackagePlansStatisticsSection";
import PackagePlanAddModal from "@/components/modals/PackagePlanAddModal";
import PackagePlanEditModal from "@/components/modals/PackagePlanEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/package-plans-page-slice";
import type { RootState } from "@/redux/store";
import {
  deletePackagePlan,
  fetchPackagePlans,
} from "@/services/package-plan.service";
import type { TPackagePlan } from "@/types/package-plan.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PackagePlansPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedPackagePlan } = useSelector(
    (state: RootState) => state.packagePlansPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (packagePlan: TPackagePlan) => {
    dispatch(openEditModal(packagePlan));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deletePackagePlan(_id),
    onSuccess: (data) => {
      toast.success(
        data?.message || "Package Plan deleted successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["package-plans"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete package plan",
      );
    },
  });

  const onDelete = async (packagePlan: TPackagePlan) => {
    const ok = await confirm({
      title: "Delete Package Plan",
      message: "Are you sure you want to delete this Package Plan?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(packagePlan._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["package-plans"],
    queryFn: () => fetchPackagePlans({ sort: "created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Package Plans"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Package Plan
          </Button>
        }
      />
      <PackagePlansStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <PackagePlansDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <PackagePlanAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <PackagePlanEditModal
        default={selectedPackagePlan || ({} as TPackagePlan)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedPackagePlan || ({} as TPackagePlan))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default PackagePlansPage;

