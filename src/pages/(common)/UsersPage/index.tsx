import UsersDataTableSection from "@/components/(common)/users-page/UsersDataTableSection";
import UsersStatisticsSection from "@/components/(common)/users-page/UsersStatisticsSection";
import UserEditModal from "@/components/modals/UserEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeEditModal,
  openEditModal,
} from "@/redux/slices/users-page-slice";
import type { RootState } from "@/redux/store";
import { deleteUser, fetchUsers } from "@/services/user.service";
import type { ErrorResponse } from "@/types/response.type";
import type { TUser } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const UsersPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isEditModalOpen, selectedUser } = useSelector(
    (state: RootState) => state.usersPage,
  );

  const onOpenEditModal = (User: TUser) => {
    dispatch(openEditModal(User));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteUser(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete User");
      console.error("Delete User Error:", error);
    },
  });

  const onDelete = async (User: TUser) => {
    const ok = await confirm({
      title: "Delete User",
      message: "Are you sure you want to delete this User?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(User._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers({ sort: "sequence" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader name="users" />
      <UsersStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <UsersDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
          />
        </Card.Content>
      </Card>
      <UserEditModal
        default={selectedUser || ({} as TUser)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openEditModal(selectedUser || ({} as TUser)) : closeEditModal())
        }
      />
    </main>
  );
};

export default UsersPage;
