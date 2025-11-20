import FeatureEndpointsDataTableSection from "@/components/(common)/features-details-page/FeatureEndpointsDataTableSection";
import FeatureEndpointAddModal from "@/components/modals/FeatureEndpointAddModal";
import FeatureEndpointEditModal from "@/components/modals/FeatureEndpointEditModal";
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
import {
  deleteFeatureEndpoint,
  fetchFeature,
  fetchFeatureEndpoints,
} from "@/services/feature-endpoint.service";
import { fetchFeature as fetchFeatureById } from "@/services/feature.service";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";

const FeaturesDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const feature = (location.state as { feature?: any })?.feature;

  const {
    isAddModalOpen,
    isEditModalOpen,
    selectedFeature,
  } = useSelector((state: RootState) => state.featuresPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (endpoint: TFeatureEndpoint) => {
    dispatch(openEditModal(endpoint as any));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteFeatureEndpoint(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Feature Endpoint deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feature-endpoints"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to delete feature endpoint",
      );
    },
  });

  const onDelete = async (endpoint: TFeatureEndpoint) => {
    const ok = await confirm({
      title: "Delete Feature Endpoint",
      message: "Are you sure you want to delete this Feature Endpoint?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(endpoint._id);
    }
  };

  const { data: featureData, isLoading: featureLoading } = useQuery({
    queryKey: ["feature", id],
    queryFn: () => fetchFeatureById(id || ""),
    enabled: !!id,
  });

  const { data: endpointsData, isLoading: endpointsLoading } = useQuery({
    queryKey: ["feature-endpoints", id],
    queryFn: () =>
      fetchFeatureEndpoints({
        feature: id,
        sort: "created_at",
      }),
    enabled: !!id,
  });

  const currentFeature = featureData?.data || feature;

  return (
    <main className="space-y-6">
      <PageHeader
        name={currentFeature?.name || "Feature Details"}
        description={currentFeature?.description}
      />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Feature Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {currentFeature?.name}
                </p>
                {currentFeature?.description && (
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {currentFeature?.description}
                  </p>
                )}
                {currentFeature?.type && (
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {currentFeature?.type}
                  </p>
                )}
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  {currentFeature?.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header className="border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Feature Endpoints</h2>
            <Button onClick={() => onOpenAddModal()}>
              <Plus className="h-4 w-4" /> Add Endpoint
            </Button>
          </div>
        </Card.Header>
        <Card.Content>
          <FeatureEndpointsDataTableSection
            data={endpointsData?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={endpointsLoading}
            isError={false}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
            featureId={id || ""}
          />
        </Card.Content>
      </Card>
      <FeatureEndpointAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
        featureId={id || ""}
      />
      <FeatureEndpointEditModal
        default={selectedFeature || ({} as any)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedFeature || ({} as any))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default FeaturesDetailsPage;

