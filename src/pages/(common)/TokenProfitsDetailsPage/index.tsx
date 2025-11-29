import TokenProfitHistoriesDataTableSection from "@/components/(common)/token-profits-details-page/TokenProfitHistoriesDataTableSection";
import TokenProfitHistoryViewModal from "@/components/modals/TokenProfitHistoryViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  closeHistoryModal,
  openHistoryModal,
} from "@/redux/slices/token-profits-page-slice";
import type { RootState } from "@/redux/store";
import { fetchTokenProfitHistories } from "@/services/token-profit-history.service";
import { fetchTokenProfit } from "@/services/token-profit.service";
import type { TTokenProfit } from "@/types/token-profit.type";
import type { ErrorResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  History,
  Percent,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const TokenProfitsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const tokenProfit = (location.state as { tokenProfit?: TTokenProfit })
    ?.tokenProfit;

  const { isHistoryModalOpen, selectedTokenProfit } = useSelector(
    (state: RootState) => state.tokenProfitsPage,
  );

  const onOpenHistoryModal = () => {
    dispatch(openHistoryModal(selectedTokenProfit || ({} as any)));
  };

  const {
    data: profitResponse,
    isLoading,
    error,
  } = useQuery({
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">
            Error loading token profit
          </h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<ErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentProfit) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Token Profit not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Token Profit Details"
          description="View token profit information and history"
          slot={<TrendingUp />}
        />

        {/* Profit Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Profit Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="border-border bg-primary/10 text-primary flex h-24 w-24 items-center justify-center rounded-full border-4">
                    <TrendingUp className="h-12 w-12" />
                  </div>
                  {currentProfit.is_active && (
                    <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      {currentProfit.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      {currentProfit.percentage}% Profit
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-sm font-medium capitalize flex items-center gap-2",
                        currentProfit.is_active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      )}
                    >
                      {currentProfit.is_active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {currentProfit.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Profit Details Card */}
        <Card>
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Profit Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Profit ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentProfit._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Name</div>
                  <div className="text-foreground text-sm font-semibold">
                    {currentProfit.name}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Percentage
                  </div>
                  <div className="text-foreground text-2xl font-bold flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    {currentProfit.percentage}%
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Status</div>
                  <div className="text-foreground text-sm capitalize">
                    {currentProfit.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                {currentProfit.created_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Created At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentProfit.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentProfit.updated_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Updated At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentProfit.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* History Card */}
        <Card>
          <Card.Header className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-xl font-semibold">
                Profit History
              </h2>
              <Button onClick={() => onOpenHistoryModal()} variant="outline">
                <History className="h-4 w-4" /> View All History
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <TokenProfitHistoriesDataTableSection
              data={historiesData?.data || []}
              isLoading={historiesLoading}
              isError={false}
              onView={onOpenHistoryModal}
            />
          </Card.Content>
        </Card>

        {/* Modals */}
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
      </div>
    </div>
  );
};

export default TokenProfitsDetailsPage;
