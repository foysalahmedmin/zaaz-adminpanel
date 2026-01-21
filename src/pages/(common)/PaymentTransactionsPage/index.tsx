import PaymentTransactionsDataTableSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsDataTableSection";
import PaymentTransactionsFilterSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsFilterSection";
import PaymentTransactionsStatisticsSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsStatisticsSection";
import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentMethods } from "@/services/payment-method.service";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PaymentTransactionsPage = () => {
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedPaymentTransaction } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );

  const onOpenViewModal = (transaction: TPaymentTransaction) => {
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
  const [status, setStatus] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setStatus("");
    setPaymentMethod("");
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
    if (paymentMethod) params.payment_method = paymentMethod;

    return params;
  }, [search, sort, page, limit, gte, lte, status, paymentMethod]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-transactions", queryParams],
    queryFn: () => fetchPaymentTransactions(queryParams),
  });

  // Fetch payment methods for filter
  const { data: paymentMethodsData } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => fetchPaymentMethods({ limit: 100 }),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Payment Transactions" />
      <PaymentTransactionsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <PaymentTransactionsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        status={status}
        setStatus={setStatus}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentMethodsData={paymentMethodsData}
        onReset={resetFilters}
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
              ? openViewModal(
                  selectedPaymentTransaction || ({} as TPaymentTransaction),
                )
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default PaymentTransactionsPage;
