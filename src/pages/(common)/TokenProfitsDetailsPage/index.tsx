import TokenProfitHistoriesDataTableSection from "@/components/(common)/token-profits-details-page/TokenProfitHistoriesDataTableSection";
import TokenProfitHistoryViewModal from "@/components/modals/TokenProfitHistoryViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import {
  closeHistoryModal,
  openHistoryModal,
} from "@/redux/slices/token-profits-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenProfitHistories } from "@/services/token-profit-history.service";
import { fetchTokenProfit } from "@/services/token-profit.service";
import type { TTokenProfitHistory } from "@/types/token-profit-history.type";
import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const TokenProfitsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { activeBreadcrumbs } = useMenu();
  const dispatch = useDispatch();

  const tokenProfit = (location.state as { tokenProfit?: any })?.tokenProfit;

  const { isHistoryModalOpen, selectedTokenProfit } = useSelector(
    (state: RootState) => state.tokenProfitsPage,
  );

  const onOpenHistoryModal = (history: TTokenProfitHistory) => {
    dispatch(openHistoryModal(selectedTokenProfit || ({} as any)));
  };

  const { data: profitResponse, isLoading: profitLoading } = useQuery({
    queryKey: ["token-profit", id],
    queryFn: () => fetchTokenProfit(id || ""),
    enabled: !!id,
  });

  const { data: historiesData, isLoading: historiesLoading } = useQuery({
    queryKey: ["token-profit-histories", id],
    queryFn: () => fetchTokenProfitHistories(id || ""),
    enabled: !!id,
  });

  const currentProfit = profitResponse?.data || tokenProfit;

  return (
    <main className="space-y-6">
      <PageHeader
        name={currentProfit?.name || "Token Profit Details"}
      />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Profit Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {currentProfit?.name}
                </p>
                <p>
                  <span className="font-medium">Percentage:</span>{" "}
                  {currentProfit?.percentage}%
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {currentProfit?.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header className="border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Profit History</h2>
            <Button
              onClick={() => onOpenHistoryModal({} as TTokenProfitHistory)}
              variant="outline"
            >
              <History className="h-4 w-4" /> View All History
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <TokenProfitHistoriesDataTableSection
            data={historiesData?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={historiesLoading}
            isError={false}
            onView={onOpenHistoryModal}
          />
        </Card.Content>
      </Card>
      <TokenProfitHistoryViewModal
        tokenProfitId={id || ""}
        isOpen={isHistoryModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openHistoryModal(selectedTokenProfit || ({} as any))
              : closeHistoryModal(),
          )
        }
      />
    </main>
  );
};

export default TokenProfitsDetailsPage;

