import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransaction } from "@/services/payment-transaction.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const PaymentTransactionsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const transaction = (location.state as { transaction?: any })?.transaction;

  const { isViewModalOpen, selectedPaymentTransaction } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["payment-transaction", id],
    queryFn: () => fetchPaymentTransaction(id || ""),
    enabled: !!id,
  });

  const currentTransaction = data?.data || transaction;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentTransaction) {
    return <div>Transaction not found</div>;
  }

  return (
    <main className="space-y-6">
      <PageHeader
        name={`Payment Transaction: ${currentTransaction.gateway_transaction_id}`}
      />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Transaction Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {currentTransaction.gateway_transaction_id}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {currentTransaction.status}
                </p>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {currentTransaction.currency === "USD" ? "$" : "৳"}
                  {currentTransaction.amount} {currentTransaction.currency}
                </p>
                {currentTransaction.gateway_fee && (
                  <p>
                    <span className="font-medium">Gateway Fee:</span>{" "}
                    {currentTransaction.currency === "USD" ? "$" : "৳"}
                    {currentTransaction.gateway_fee}
                  </p>
                )}
                {currentTransaction.paid_at && (
                  <p>
                    <span className="font-medium">Paid At:</span>{" "}
                    {new Date(currentTransaction.paid_at).toLocaleString()}
                  </p>
                )}
                {currentTransaction.failed_at && (
                  <p>
                    <span className="font-medium">Failed At:</span>{" "}
                    {new Date(currentTransaction.failed_at).toLocaleString()}
                  </p>
                )}
                {currentTransaction.failure_reason && (
                  <p>
                    <span className="font-medium">Failure Reason:</span>{" "}
                    {currentTransaction.failure_reason}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <PaymentTransactionViewModal
        default={currentTransaction}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(currentTransaction)
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default PaymentTransactionsDetailsPage;

