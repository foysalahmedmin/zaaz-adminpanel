import PackageTransactionsDataTableSection from "@/components/(common)/package-transactions-page/PackageTransactionsDataTableSection";
import PackageTransactionsFilterSection from "@/components/(common)/package-transactions-page/PackageTransactionsFilterSection";
import PackageTransactionsStatisticsSection from "@/components/(common)/package-transactions-page/PackageTransactionsStatisticsSection";
import PackageTransactionViewModal from "@/components/modals/PackageTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/package-transactions-page-slice";
import type { RootState } from "@/redux/store";
import type { TPackageTransaction } from "@/services/package-transaction.service";
import {
  deletePackageTransaction,
  fetchPackageTransactions,
} from "@/services/package-transaction.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PackageTransactionsPage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const { isViewModalOpen, selectedPackageTransaction } = useSelector(
    (state: RootState) => state.packageTransactionsPage,
  );

  const onOpenViewModal = (transaction: TPackageTransaction) => {
    dispatch(openViewModal(transaction));
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [increaseSource, setIncreaseSource] = useState<string>("");

  const resetFilters = () => {
    setIncreaseSource("");
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
    if (increaseSource) params.increase_source = increaseSource;

    return params;
  }, [search, sort, page, limit, increaseSource]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePackageTransaction(id),
    onSuccess: () => {
      toast.success("Transaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["package-transactions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete transaction",
      );
    },
  });

  const handleDelete = async (transaction: TPackageTransaction) => {
    const ok = await confirm({
      title: "Delete Transaction",
      message:
        "Are you sure you want to delete this package assignment? This will reverse the credit change in the user's wallet.",
      confirmText: "Delete",
    });

    if (ok && transaction._id) {
      deleteMutation.mutate(transaction._id);
    }
  };

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["package-transactions", queryParams],
    queryFn: () => fetchPackageTransactions(queryParams),
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
        name="Package Transactions"
        description="History of all package assignments to users"
        slot={<Package />}
      />

      <PackageTransactionsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />

      <PackageTransactionsFilterSection
        increaseSource={increaseSource}
        setIncreaseSource={setIncreaseSource}
        onReset={resetFilters}
      />

      <Card>
        <Card.Content>
          <PackageTransactionsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
            onDelete={handleDelete}
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

      <PackageTransactionViewModal
        default={selectedPackageTransaction || ({} as TPackageTransaction)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(
                  selectedPackageTransaction || ({} as TPackageTransaction),
                )
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default PackageTransactionsPage;
