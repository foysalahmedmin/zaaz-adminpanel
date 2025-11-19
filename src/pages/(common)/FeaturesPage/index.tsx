import FeaturesDataTableSection from "@/components/(common)/features-page/FeaturesDataTableSection";
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
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
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
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete feature");
      console.error("Delete Feature Error:", error);
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["features"],
    queryFn: () => fetchFeatures({ sort: "created_at" }),
  });

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
      <FeaturesStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <FeaturesDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
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
