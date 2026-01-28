import FeatureEndpointsDataTableSection from "@/components/(common)/features-details-page/FeatureEndpointsDataTableSection";
import FeatureEndpointAddModal from "@/components/modals/FeatureEndpointAddModal";
import FeatureEndpointEditModal from "@/components/modals/FeatureEndpointEditModal";
import FeatureEndpointViewModal from "@/components/modals/FeatureEndpointViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import { cn } from "@/lib/utils";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
} from "@/redux/slices/features-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteFeatureEndpoint,
  fetchFeatureEndpoints,
} from "@/services/feature-endpoint.service";
import { fetchFeature as fetchFeatureById } from "@/services/feature.service";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { TFeature } from "@/types/feature.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Plus,
  Settings,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";

const FeaturesDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEndpointForView, setSelectedEndpointForView] =
    useState<TFeatureEndpoint | null>(null);

  const feature = (location.state as { feature?: TFeature })?.feature;

  const { isAddModalOpen, isEditModalOpen, selectedFeature } = useSelector(
    (state: RootState) => state.featuresPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (endpoint: TFeatureEndpoint) => {
    dispatch(openEditModal(endpoint as any));
  };

  const onOpenViewModal = (endpoint: TFeatureEndpoint) => {
    setSelectedEndpointForView(endpoint);
    setIsViewModalOpen(true);
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteFeatureEndpoint(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Feature Endpoint deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feature-endpoints"] });
    },
    onError: (error: AxiosError<TErrorResponse>) => {
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

  const {
    data: featureData,
    isLoading,
    error,
  } = useQuery({
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading feature</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<TErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentFeature) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Feature not found</h2>
        </div>
      </div>
    );
  }

  const endpointsCount = endpointsData?.data?.length || 0;

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="Feature Details"
          description="View feature information and endpoints"
          slot={<Settings />}
        />

        {/* Feature Information Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="space-y-6">
              {/* Feature Header */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="border-border bg-primary/10 text-primary flex h-24 w-24 items-center justify-center rounded-full border-4">
                    <Settings className="h-12 w-12" />
                  </div>
                  {currentFeature.is_active && (
                    <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      {currentFeature.name}
                    </h3>
                    {currentFeature.description && (
                      <p className="text-muted-foreground mt-1">
                        {currentFeature.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {currentFeature.type && (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 capitalize dark:text-blue-400">
                        {currentFeature.type}
                      </span>
                    )}
                    <span
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium capitalize",
                        currentFeature.is_active
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400",
                      )}
                    >
                      {currentFeature.is_active ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {currentFeature.is_active ? "Active" : "Inactive"}
                    </span>
                    {endpointsCount > 0 && (
                      <span className="rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                        {endpointsCount} Endpoint
                        {endpointsCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Feature Details Card */}
        <Card>
          <div className="space-y-6 p-6">
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Feature Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Feature ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {currentFeature._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">Name</div>
                  <div className="text-foreground text-sm font-semibold">
                    {currentFeature.name}
                  </div>
                </div>
                {currentFeature.type && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Type
                    </div>
                    <div className="text-foreground text-sm capitalize">
                      {currentFeature.type}
                    </div>
                  </div>
                )}
                {currentFeature.path && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Path
                    </div>
                    <div className="text-foreground font-mono text-sm">
                      {currentFeature.path}
                    </div>
                  </div>
                )}
                {currentFeature.prefix && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Prefix
                    </div>
                    <div className="text-foreground font-mono text-sm">
                      {currentFeature.prefix}
                    </div>
                  </div>
                )}
                {currentFeature.sequence !== undefined && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Sequence
                    </div>
                    <div className="text-foreground text-sm">
                      {currentFeature.sequence}
                    </div>
                  </div>
                )}
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    Status
                  </div>
                  <div className="text-foreground text-sm capitalize">
                    {currentFeature.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                {endpointsCount > 0 && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Total Endpoints
                    </div>
                    <div className="text-foreground text-xl font-bold">
                      {endpointsCount}
                    </div>
                  </div>
                )}
                {currentFeature.created_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Created At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentFeature.created_at).toLocaleString()}
                    </div>
                  </div>
                )}
                {currentFeature.updated_at && (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="text-muted-foreground mb-1 text-sm">
                      Updated At
                    </div>
                    <div className="text-foreground text-sm">
                      {new Date(currentFeature.updated_at).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {currentFeature.description && (
              <div>
                <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
                  <FileText className="mr-2 h-5 w-5" />
                  Description
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Endpoints Card */}
        <Card>
          <Card.Header className="border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-xl font-semibold">
                Feature Endpoints
              </h2>
              <Button onClick={() => onOpenAddModal()}>
                <Plus className="h-4 w-4" /> Add Endpoint
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <FeatureEndpointsDataTableSection
              data={endpointsData?.data || []}
              isLoading={endpointsLoading}
              isError={false}
              onEdit={onOpenEditModal}
              onDelete={onDelete}
              onView={onOpenViewModal}
            />
          </Card.Content>
        </Card>

        {/* Modals */}
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
        <FeatureEndpointViewModal
          default={selectedEndpointForView || ({} as any)}
          isOpen={isViewModalOpen}
          setIsOpen={(value: boolean) => {
            setIsViewModalOpen(value);
            if (!value) {
              setSelectedEndpointForView(null);
            }
          }}
        />
      </div>
    </div>
  );
};

export default FeaturesDetailsPage;
