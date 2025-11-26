import PackagesDataTableSection from "@/components/(common)/packages-page/PackagesDataTableSection";
import PackagesStatisticsSection from "@/components/(common)/packages-page/PackagesStatisticsSection";
import PackageAddModal from "@/components/modals/PackageAddModal";
import PackageEditModal from "@/components/modals/PackageEditModal";
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
} from "@/redux/slices/packages-page-slice";
import type { RootState } from "@/redux/store";
import {
  deletePackage,
  fetchPackages,
  updatePackageIsInitial,
} from "@/services/package.service";
import type { TPackage } from "@/types/package.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const PackagesPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedPackage } = useSelector(
    (state: RootState) => state.packagesPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (pkg: TPackage) => {
    dispatch(openEditModal(pkg));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deletePackage(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Package deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete package");
    },
  });

  const toggleInitial_mutation = useMutation({
    mutationFn: ({ id, is_initial }: { id: string; is_initial: boolean }) =>
      updatePackageIsInitial(id, is_initial),
    onSuccess: (data) => {
      toast.success(
        data?.message || "Package initial status updated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to update package initial status",
      );
    },
  });

  const onToggleInitial = (pkg: TPackage, is_initial: boolean) => {
    toggleInitial_mutation.mutate({ id: pkg._id, is_initial });
  };

  const onDelete = async (pkg: TPackage) => {
    const ok = await confirm({
      title: "Delete Package",
      message: "Are you sure you want to delete this Package?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(pkg._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackages({ sort: "created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Packages"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Package
          </Button>
        }
      />
      <PackagesStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <PackagesDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
            onToggleInitial={onToggleInitial}
          />
        </Card.Content>
      </Card>
      <PackageAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <PackageEditModal
        default={selectedPackage || ({} as TPackage)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedPackage || ({} as TPackage))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default PackagesPage;

