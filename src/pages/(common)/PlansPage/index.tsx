import PlansDataTableSection from "@/components/(common)/plans-page/PlansDataTableSection";
import PlansFilterSection from "@/components/(common)/plans-page/PlansFilterSection";
import PlansStatisticsSection from "@/components/(common)/plans-page/PlansStatisticsSection";
import PlanAddModal from "@/components/modals/PlanAddModal";
import PlanEditModal from "@/components/modals/PlanEditModal";
import PlanViewModal from "@/components/modals/PlanViewModal";
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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PlansPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlanForView, setSelectedPlanForView] = useState<TPlan | null>(
    null,
  );

  const { isAddModalOpen, isEditModalOpen, selectedPlan } = useSelector(
    (state: RootState) => state.plansPage,
  );

  // State management for search, sort, pagination
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filter states
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("");

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (plan: TPlan) => {
    dispatch(openEditModal(plan));
  };

  const onOpenViewModal = (plan: TPlan) => {
    setSelectedPlanForView(plan);
    setIsViewModalOpen(true);
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

  // Build query parameters from state
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (sort) params.sort = sort;
    if (search) params.search = search;
    if (gte) params.gte = gte;
    if (lte) params.lte = lte;
    if (isActive) params.is_active = isActive;

    return params;
  }, [search, sort, page, limit, gte, lte, isActive]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans", queryParams],
    queryFn: () => fetchPlans(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  const resetFilters = () => {
    setGte("");
    setLte("");
    setIsActive("");
    setSearch("");
    setSort("-created_at");
    setPage(1);
  };

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

      <PlansStatisticsSection data={data?.data || []} meta={data?.meta} />

      <PlansFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        isActive={isActive}
        setIsActive={setIsActive}
        onReset={resetFilters}
      />

      <Card>
        <Card.Content>
          <PlansDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
            onView={onOpenViewModal}
            state={{
              search,
              sort,
              page,
              limit,
              total,
              setSearch,
              setSort,
              setPage,
              setLimit,
            }}
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
      <PlanViewModal
        default={selectedPlanForView || ({} as TPlan)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) => {
          setIsViewModalOpen(value);
          if (!value) {
            setSelectedPlanForView(null);
          }
        }}
      />
    </main>
  );
};

export default PlansPage;
