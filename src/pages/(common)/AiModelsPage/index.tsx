import AiModelsDataTableSection from "@/components/(common)/ai-models-page/AiModelsDataTableSection";
import AiModelsFilterSection from "@/components/(common)/ai-models-page/AiModelsFilterSection";
import AiModelsStatisticsSection from "@/components/(common)/ai-models-page/AiModelsStatisticsSection";
import AiModelAddModal from "@/components/modals/AiModelAddModal";
import AiModelEditModal from "@/components/modals/AiModelEditModal";
import AiModelHistoryModal from "@/components/modals/AiModelHistoryModal";
import AiModelViewModal from "@/components/modals/AiModelViewModal";
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
} from "@/redux/slices/ai-models-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteAiModel,
  fetchAiModels,
  updateAiModel,
} from "@/services/ai-model.service";
import type { TAiModel } from "@/types/ai-model.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AiModelsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, isViewModalOpen, selectedAiModel } =
    useSelector((state: RootState) => state.aiModelsPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (model: TAiModel) => {
    dispatch(openEditModal(model));
  };

  const onHistory = (model: TAiModel) => {
    dispatch(openHistoryModal(model));
  };

  const onView = (model: TAiModel) => {
    dispatch(openViewModal(model));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteAiModel(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "AI Model deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["ai-models"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete AI Model");
    },
  });

  const toggleInitial_mutation = useMutation({
    mutationFn: ({ id, is_initial }: { id: string; is_initial: boolean }) =>
      updateAiModel(id, { is_initial }),
    onSuccess: (data) => {
      toast.success(
        data?.message || "AI Model initial status updated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["ai-models"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update AI Model initial status",
      );
    },
  });

  const onToggleInitial = (model: TAiModel, is_initial: boolean) => {
    toggleInitial_mutation.mutate({ id: model._id, is_initial });
  };

  const onDelete = async (model: TAiModel) => {
    const ok = await confirm({
      title: "Delete AI Model",
      message: "Are you sure you want to delete this AI Model?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(model._id);
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
    queryKey: ["ai-models", queryParams],
    queryFn: () => fetchAiModels(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader
        name="AI Models"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Model
          </Button>
        }
      />
      <AiModelsStatisticsSection data={data?.data || []} meta={data?.meta} />
      <AiModelsFilterSection
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
          <AiModelsDataTableSection
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

      <AiModelAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <AiModelEditModal
        default={selectedAiModel || ({} as TAiModel)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedAiModel || ({} as TAiModel))
              : closeEditModal(),
          )
        }
      />
      <AiModelViewModal
        default={selectedAiModel || ({} as TAiModel)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedAiModel || ({} as TAiModel))
              : closeViewModal(),
          )
        }
      />
      <AiModelHistoryModal />
    </main>
  );
};

export default AiModelsPage;
