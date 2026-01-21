import FeaturePopupsDataTableSection from "@/components/(common)/feature-popups-page/FeaturePopupsDataTableSection";
import FeaturePopupsFilterSection from "@/components/(common)/feature-popups-page/FeaturePopupsFilterSection";
import FeaturePopupsStatisticsSection from "@/components/(common)/feature-popups-page/FeaturePopupsStatisticsSection";
import FeaturePopupAddModal from "@/components/modals/FeaturePopupAddModal";
import FeaturePopupEditModal from "@/components/modals/FeaturePopupEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/feature-popups-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteFeaturePopup,
  fetchFeaturePopups,
} from "@/services/feature-popup.service";
import type { TFeaturePopup } from "@/types/feature-popup.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FeaturePopupsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedFeaturePopup } = useSelector(
    (state: RootState) => state.featurePopupsPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (popup: TFeaturePopup) => {
    dispatch(openEditModal(popup));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteFeaturePopup(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Feature popup deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feature-popups"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete feature popup",
      );
    },
  });

  const onDelete = async (popup: TFeaturePopup) => {
    const ok = await confirm({
      title: "Delete Feature Popup",
      message: "Are you sure you want to delete this Feature Popup?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(popup._id);
    }
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
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
    if (status) params.is_active = status === "active" ? "true" : "false";

    return params;
  }, [search, sort, page, limit, gte, lte, status]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feature-popups", queryParams],
    queryFn: () => fetchFeaturePopups(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader
        name="Feature Popups"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Feature Popup
          </Button>
        }
      />
      <FeaturePopupsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <FeaturePopupsFilterSection
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
          <FeaturePopupsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
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
      <FeaturePopupAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <FeaturePopupEditModal
        default={selectedFeaturePopup || ({} as TFeaturePopup)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedFeaturePopup || ({} as TFeaturePopup))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default FeaturePopupsPage;
