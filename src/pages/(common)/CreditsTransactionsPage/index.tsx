import CreditsTransactionsDataTableSection from "@/components/(common)/credits-transactions-page/CreditsTransactionsDataTableSection";
import CreditsTransactionsFilterSection from "@/components/(common)/credits-transactions-page/CreditsTransactionsFilterSection";
import CreditsTransactionsStatisticsSection from "@/components/(common)/credits-transactions-page/CreditsTransactionsStatisticsSection";
import CreditsTransactionViewModal from "@/components/modals/CreditsTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/credits-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchCreditsTransactions } from "@/services/credits-transaction.service";
import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreditsTransactionsPage = () => {
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedCreditsTransaction } = useSelector(
    (state: RootState) => state.creditsTransactionsPage,
  );

  const onOpenViewModal = (transaction: TCreditsTransaction) => {
    dispatch(openViewModal(transaction));
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
  const [type, setType] = useState<string>("");
  const [increaseSource, setIncreaseSource] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setType("");
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
    if (gte) params.gte = gte;
    if (lte) params.lte = lte;
    if (type) params.type = type;
    if (increaseSource) params.increase_source = increaseSource;

    return params;
  }, [search, sort, page, limit, gte, lte, type, increaseSource]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["credits-transactions", queryParams],
    queryFn: () => fetchCreditsTransactions(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Credits Transactions" />
      <CreditsTransactionsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <CreditsTransactionsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        type={type}
        setType={setType}
        increaseSource={increaseSource}
        setIncreaseSource={setIncreaseSource}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <CreditsTransactionsDataTableSection
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
      <CreditsTransactionViewModal
        default={selectedCreditsTransaction || ({} as TCreditsTransaction)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(
                  selectedCreditsTransaction || ({} as TCreditsTransaction),
                )
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default CreditsTransactionsPage;
