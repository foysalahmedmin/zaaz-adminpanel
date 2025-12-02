import TokenTransactionsDataTableSection from "@/components/(common)/token-transactions-page/TokenTransactionsDataTableSection";
import TokenTransactionsStatisticsSection from "@/components/(common)/token-transactions-page/TokenTransactionsStatisticsSection";
import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenTransactions } from "@/services/token-transaction.service";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";

const TokenTransactionsPage = () => {
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedTokenTransaction } = useSelector(
    (state: RootState) => state.tokenTransactionsPage,
  );

  const onOpenViewModal = (transaction: TTokenTransaction) => {
    dispatch(openViewModal(transaction));
  };

  // State management for search, sort, pagination
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Build query parameters from state
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
    };

    if (sort) {
      params.sort = sort;
    }

    if (search) {
      params.search = search;
    }

    return params;
  }, [search, sort, page, limit]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["token-transactions", queryParams],
    queryFn: () => fetchTokenTransactions(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    } else if (data?.data) {
      setTotal(data.data.length);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Token Transactions" />
      <TokenTransactionsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <Card>
        <Card.Content>
          <TokenTransactionsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
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
      <TokenTransactionViewModal
        default={selectedTokenTransaction || ({} as TTokenTransaction)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedTokenTransaction || ({} as TTokenTransaction))
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default TokenTransactionsPage;

