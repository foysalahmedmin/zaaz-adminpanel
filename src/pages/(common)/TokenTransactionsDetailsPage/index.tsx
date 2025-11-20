import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenTransaction } from "@/services/token-transaction.service";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const TokenTransactionsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const transaction = (location.state as { transaction?: any })?.transaction;

  const { isViewModalOpen } = useSelector(
    (state: RootState) => state.tokenTransactionsPage,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["token-transaction", id],
    queryFn: () => fetchTokenTransaction(id || ""),
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
        name={`Token Transaction: ${currentTransaction.type}`}
      />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Transaction Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Type:</span>{" "}
                  {currentTransaction.type}
                </p>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {currentTransaction.type === "increase" ? "+" : "-"}
                  {currentTransaction.amount} tokens
                </p>
                {currentTransaction.increase_source && (
                  <p>
                    <span className="font-medium">Source:</span>{" "}
                    {currentTransaction.increase_source}
                  </p>
                )}
                {currentTransaction.created_at && (
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(currentTransaction.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <TokenTransactionViewModal
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

export default TokenTransactionsDetailsPage;

