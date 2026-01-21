import CreditsProfitsDataTableSection from "@/components/(common)/credits-profits-page/CreditsProfitsDataTableSection";
import CreditsProfitsFilterSection from "@/components/(common)/credits-profits-page/CreditsProfitsFilterSection";
import CreditsProfitsStatisticsSection from "@/components/(common)/credits-profits-page/CreditsProfitsStatisticsSection";
import CreditsProfitAddModal from "@/components/modals/CreditsProfitAddModal";
import CreditsProfitEditModal from "@/components/modals/CreditsProfitEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/credits-profits-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteCreditsProfit,
  fetchCreditsProfits,
} from "@/services/credits-profit.service";
import type { TCreditsProfit } from "@/types/credits-profit.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CreditsProfitsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedCreditsProfit } =
    useSelector((state: RootState) => state.creditsProfitsPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (profit: TCreditsProfit) => {
    dispatch(openEditModal(profit));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteCreditsProfit(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Credits Profit deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["credits-profits"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete credits profit",
      );
    },
  });

  const onDelete = async (profit: TCreditsProfit) => {
    const ok = await confirm({
      title: "Delete Credits Profit",
      message: "Are you sure you want to delete this Credits Profit?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(profit._id);
    }
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setStatus("");
    setSearch("");
    setPage(1);
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
    if (status) params.status = status;

    return params;
  }, [search, sort, page, limit, gte, lte, status]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["credits-profits", queryParams],
    queryFn: () => fetchCreditsProfits(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader
        name="Credits Profits"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Credits Profit
          </Button>
        }
      />
      <CreditsProfitsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <CreditsProfitsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        status={status}
        setStatus={setStatus}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <CreditsProfitsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
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
      <CreditsProfitAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <CreditsProfitEditModal
        default={selectedCreditsProfit || ({} as TCreditsProfit)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedCreditsProfit || ({} as TCreditsProfit))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default CreditsProfitsPage;
