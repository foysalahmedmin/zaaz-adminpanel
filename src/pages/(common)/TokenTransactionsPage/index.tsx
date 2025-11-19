import TokenTransactionsDataTableSection from "@/components/(common)/token-transactions-page/TokenTransactionsDataTableSection";
import TokenTransactionsStatisticsSection from "@/components/(common)/token-transactions-page/TokenTransactionsStatisticsSection";
import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenTransactions } from "@/services/token-transaction.service";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

const TokenTransactionsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedTokenTransaction } = useSelector(
    (state: RootState) => state.tokenTransactionsPage,
  );

  const onOpenViewModal = (transaction: TTokenTransaction) => {
    dispatch(openViewModal(transaction));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["token-transactions"],
    queryFn: () => fetchTokenTransactions({ sort: "-created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader name="Token Transactions" />
      <TokenTransactionsStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <TokenTransactionsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
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

