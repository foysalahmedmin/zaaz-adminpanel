import BillingSettingsDataTableSection from "@/components/(common)/billing-settings-page/BillingSettingsDataTableSection";
import BillingSettingsFilterSection from "@/components/(common)/billing-settings-page/BillingSettingsFilterSection";
import BillingSettingsStatisticsSection from "@/components/(common)/billing-settings-page/BillingSettingsStatisticsSection";
import BillingSettingAddModal from "@/components/modals/BillingSettingAddModal";
import BillingSettingEditModal from "@/components/modals/BillingSettingEditModal";
import BillingSettingHistoryModal from "@/components/modals/BillingSettingHistoryModal";
import BillingSettingViewModal from "@/components/modals/BillingSettingViewModal";
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
  openHistoryModal,
  openViewModal,
} from "@/redux/slices/billing-settings-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteBillingSetting,
  fetchBillingSettings,
  updateBillingSetting,
} from "@/services/billing-setting.service";
import type { TBillingSetting } from "@/types/billing-setting.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const BillingSettingsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const {
    isAddModalOpen,
    isEditModalOpen,
    isViewModalOpen,
    selectedBillingSetting,
  } = useSelector((state: RootState) => state.billingSettingsPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (setting: TBillingSetting) => {
    dispatch(openEditModal(setting));
  };

  const onHistory = (setting: TBillingSetting) => {
    dispatch(openHistoryModal(setting));
  };

  const onView = (setting: TBillingSetting) => {
    dispatch(openViewModal(setting));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteBillingSetting(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Billing Setting deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["billing-settings"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete Billing Setting",
      );
    },
  });

  const toggleInitial_mutation = useMutation({
    mutationFn: ({ id, is_initial }: { id: string; is_initial: boolean }) =>
      updateBillingSetting(id, { is_initial }),
    onSuccess: (data) => {
      toast.success(
        data?.message || "Billing Setting initial status updated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["billing-settings"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update Billing Setting initial status",
      );
    },
  });

  const onToggleInitial = (setting: TBillingSetting, is_initial: boolean) => {
    toggleInitial_mutation.mutate({ id: setting._id, is_initial });
  };

  const onDelete = async (setting: TBillingSetting) => {
    const ok = await confirm({
      title: "Delete Billing Setting",
      message: "Are you sure you want to delete this Billing Setting?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(setting._id);
    }
  };

  // State management
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setStatus("");
    setSearch("");
    setPage(1);
  };

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (sort) params.sort = sort;
    if (search) params.search = search;
    if (gte) params.gte = gte;
    if (lte) params.lte = lte;
    if (status) params.is_active = status === "active" ? "true" : "false";

    return params;
  }, [search, sort, page, limit, gte, lte, status]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["billing-settings", queryParams],
    queryFn: () => fetchBillingSettings(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader
        name="Billing Settings"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Setting
          </Button>
        }
      />
      <BillingSettingsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <BillingSettingsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        status={status}
        setStatus={setStatus}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <BillingSettingsDataTableSection
            data={data?.data || []}
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
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
            onHistory={onHistory}
            onView={onView}
            onToggleInitial={onToggleInitial}
          />
        </Card.Content>
      </Card>

      <BillingSettingAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <BillingSettingEditModal
        default={selectedBillingSetting || ({} as TBillingSetting)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedBillingSetting || ({} as TBillingSetting))
              : closeEditModal(),
          )
        }
      />
      <BillingSettingViewModal
        default={selectedBillingSetting || ({} as TBillingSetting)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedBillingSetting || ({} as TBillingSetting))
              : closeViewModal(),
          )
        }
      />
      <BillingSettingHistoryModal />
    </main>
  );
};

export default BillingSettingsPage;
