import FeaturesDataTableSection from "@/components/(common)/features-page/FeaturesDataTableSection";
import FeaturesFilterSection from "@/components/(common)/features-page/FeaturesFilterSection";
import FeaturesStatisticsSection from "@/components/(common)/features-page/FeaturesStatisticsSection";
import FeatureAddModal from "@/components/modals/FeatureAddModal";
import FeatureEditModal from "@/components/modals/FeatureEditModal";
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
} from "@/redux/slices/features-page-slice";
import type { RootState } from "@/redux/store";
import { deleteFeature, fetchFeatures } from "@/services/feature.service";
import type { TFeature } from "@/types/feature.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FeaturesPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedFeature } = useSelector(
    (state: RootState) => state.featuresPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (feature: TFeature) => {
    dispatch(openEditModal(feature));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteFeature(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete feature");
    },
  });

  const onDelete = async (feature: TFeature) => {
    const ok = await confirm({
      title: "Delete Feature",
      message: "Are you sure you want to delete this Feature?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(feature._id);
    }
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("sequence,created_at");
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
    queryKey: ["features", queryParams],
    queryFn: () => fetchFeatures(queryParams),
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
        name="Features"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Feature
          </Button>
        }
      />
      <FeaturesStatisticsSection data={data?.data || []} meta={data?.meta} />
      <FeaturesFilterSection
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
          <FeaturesDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
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
      <FeatureAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <FeatureEditModal
        default={selectedFeature || ({} as TFeature)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedFeature || ({} as TFeature))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default FeaturesPage;
