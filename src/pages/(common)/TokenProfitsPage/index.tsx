import TokenProfitsDataTableSection from "@/components/(common)/token-profits-page/TokenProfitsDataTableSection";
import TokenProfitsStatisticsSection from "@/components/(common)/token-profits-page/TokenProfitsStatisticsSection";
import TokenProfitAddModal from "@/components/modals/TokenProfitAddModal";
import TokenProfitEditModal from "@/components/modals/TokenProfitEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/token-profits-page-slice";
import type { RootState } from "@/redux/store";
import { deleteTokenProfit, fetchTokenProfits } from "@/services/token-profit.service";
import type { TTokenProfit } from "@/types/token-profit.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const TokenProfitsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedTokenProfit } = useSelector(
    (state: RootState) => state.tokenProfitsPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (profit: TTokenProfit) => {
    dispatch(openEditModal(profit));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteTokenProfit(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Token Profit deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["token-profits"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete token profit",
      );
      console.error("Delete Token Profit Error:", error);
    },
  });

  const onDelete = async (profit: TTokenProfit) => {
    const ok = await confirm({
      title: "Delete Token Profit",
      message: "Are you sure you want to delete this Token Profit?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(profit._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["token-profits"],
    queryFn: () => fetchTokenProfits({ sort: "created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Token Profits"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Token Profit
          </Button>
        }
      />
      <TokenProfitsStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <TokenProfitsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <TokenProfitAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <TokenProfitEditModal
        default={selectedTokenProfit || ({} as TTokenProfit)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedTokenProfit || ({} as TTokenProfit))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default TokenProfitsPage;

