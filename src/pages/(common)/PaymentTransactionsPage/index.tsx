import PaymentTransactionsDataTableSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsDataTableSection";
import PaymentTransactionsStatisticsSection from "@/components/(common)/payment-transactions-page/PaymentTransactionsStatisticsSection";
import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

const PaymentTransactionsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedPaymentTransaction } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );

  const onOpenViewModal = (transaction: TPaymentTransaction) => {
    dispatch(openViewModal(transaction));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-transactions"],
    queryFn: () => fetchPaymentTransactions({ sort: "-created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader name="Payment Transactions" />
      <PaymentTransactionsStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <PaymentTransactionsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
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

