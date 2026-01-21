import PackagePlansDataTableSection from "@/components/(common)/package-plans-page/PackagePlansDataTableSection";
import PackagePlansFilterSection from "@/components/(common)/package-plans-page/PackagePlansFilterSection";
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
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PackagePlansPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedPackagePlan } = useSelector(
    (state: RootState) => state.packagePlansPage,
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
  const [plan, setPlan] = useState<string>("");
  const [pkg, setPkg] = useState<string>("");

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (packagePlan: TPackagePlan) => {
    dispatch(openEditModal(packagePlan));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deletePackagePlan(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Package Plan deleted successfully!");
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
    if (plan) params.plan = plan;
    if (pkg) params.package = pkg;

    return params;
  }, [search, sort, page, limit, gte, lte, isActive, plan, pkg]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["package-plans", queryParams],
    queryFn: () => fetchPackagePlans(queryParams),
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
    setPlan("");
    setPkg("");
    setSearch("");
    setSort("-created_at");
    setPage(1);
  };

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

      <PackagePlansStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />

      <PackagePlansFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        isActive={isActive}
        setIsActive={setIsActive}
        plan={plan}
        setPlan={setPlan}
        pkg={pkg}
        setPkg={setPkg}
        onReset={resetFilters}
      />

      <Card>
        <Card.Content>
          <PackagePlansDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
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
