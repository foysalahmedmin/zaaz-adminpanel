import PaymentMethodsDataTableSection from "@/components/(common)/payment-methods-page/PaymentMethodsDataTableSection";
import PaymentMethodsFilterSection from "@/components/(common)/payment-methods-page/PaymentMethodsFilterSection";
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
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PaymentMethodsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const {
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    selectedPaymentMethod,
  } = useSelector((state: RootState) => state.paymentMethodsPage);

  // State management for search, sort, pagination
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filter states
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

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
    onError: (error: AxiosError<TErrorResponse>) => {
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
    if (isActive) params.is_active = isActive;
    if (currency) params.currency = currency;

    return params;
  }, [search, sort, page, limit, gte, lte, isActive, currency]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["payment-methods", queryParams],
    queryFn: () => fetchPaymentMethods(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  const resetFilters = () => {
    setGte("");
    setLte("");
    setIsActive("");
    setCurrency("");
    setSearch("");
    setSort("-created_at");
    setPage(1);
  };

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

      <PaymentMethodsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />

      <PaymentMethodsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        isActive={isActive}
        setIsActive={setIsActive}
        currency={currency}
        setCurrency={setCurrency}
        onReset={resetFilters}
      />

      <Card>
        <Card.Content>
          <PaymentMethodsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
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
