import PaymentMethodsDataTableSection from "@/components/(common)/payment-methods-page/PaymentMethodsDataTableSection";
import PaymentMethodsStatisticsSection from "@/components/(common)/payment-methods-page/PaymentMethodsStatisticsSection";
import PaymentMethodAddModal from "@/components/modals/PaymentMethodAddModal";
import PaymentMethodEditModal from "@/components/modals/PaymentMethodEditModal";
import PaymentMethodViewModal from "@/components/modals/PaymentMethodViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  closeViewModal,
  openAddModal,
  openEditModal,
  openViewModal,
} from "@/redux/slices/payment-methods-page-slice";
import type { RootState } from "@/redux/store";
import {
  deletePaymentMethod,
  fetchPaymentMethods,
} from "@/services/payment-method.service";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PaymentMethodsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, isViewModalOpen, selectedPaymentMethod } =
    useSelector((state: RootState) => state.paymentMethodsPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (paymentMethod: TPaymentMethod) => {
    dispatch(openEditModal(paymentMethod));
  };

  const onOpenViewModal = (paymentMethod: TPaymentMethod) => {
    dispatch(openViewModal(paymentMethod));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deletePaymentMethod(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Payment method deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete payment method",
      );
    },
  });

  const onDelete = async (paymentMethod: TPaymentMethod) => {
    const ok = await confirm({
      title: "Delete Payment Method",
      message: "Are you sure you want to delete this Payment Method?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(paymentMethod._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => fetchPaymentMethods({ sort: "created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Payment Methods"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Payment Method
          </Button>
        }
      />
      <PaymentMethodsStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <PaymentMethodsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <PaymentMethodAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <PaymentMethodEditModal
        default={selectedPaymentMethod || ({} as TPaymentMethod)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedPaymentMethod || ({} as TPaymentMethod))
              : closeEditModal(),
          )
        }
      />
      <PaymentMethodViewModal
        default={selectedPaymentMethod || ({} as TPaymentMethod)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedPaymentMethod || ({} as TPaymentMethod))
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default PaymentMethodsPage;
