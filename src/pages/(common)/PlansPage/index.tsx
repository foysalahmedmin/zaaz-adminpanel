import PlansDataTableSection from "@/components/(common)/plans-page/PlansDataTableSection";
import PlansStatisticsSection from "@/components/(common)/plans-page/PlansStatisticsSection";
import PlanAddModal from "@/components/modals/PlanAddModal";
import PlanEditModal from "@/components/modals/PlanEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/plans-page-slice";
import type { RootState } from "@/redux/store";
import { deletePlan, fetchPlans } from "@/services/plan.service";
import type { TPlan } from "@/types/plan.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PlansPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedPlan } = useSelector(
    (state: RootState) => state.plansPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (plan: TPlan) => {
    dispatch(openEditModal(plan));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deletePlan(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete plan");
    },
  });

  const onDelete = async (plan: TPlan) => {
    const ok = await confirm({
      title: "Delete Plan",
      message: "Are you sure you want to delete this Plan?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(plan._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchPlans({ sort: "created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Plans"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Plan
          </Button>
        }
      />
      <PlansStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <PlansDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <PlanAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <PlanEditModal
        default={selectedPlan || ({} as TPlan)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedPlan || ({} as TPlan))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default PlansPage;

