import PaymentTransactionsDataTableSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsDataTableSection";
import PaymentTransactionsStatisticsSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsStatisticsSection";
import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";

const PaymentTransactionsPage = () => {
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedPaymentTransaction } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );

  const onOpenViewModal = (transaction: TPaymentTransaction) => {
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
    queryKey: ["payment-transactions", queryParams],
    queryFn: () => fetchPaymentTransactions(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    } else if (data?.data) {
      // Fallback: use data length if meta not available
      setTotal(data.data.length);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Payment Transactions" />
      <PaymentTransactionsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <Card>
        <Card.Content>
          <PaymentTransactionsDataTableSection
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
      <PaymentTransactionViewModal
        default={selectedPaymentTransaction || ({} as TPaymentTransaction)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedPaymentTransaction || ({} as TPaymentTransaction))
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default PaymentTransactionsPage;

