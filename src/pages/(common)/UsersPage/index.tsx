import UsersDataTableSection from "@/components/(common)/users-page/UsersDataTableSection";
import UsersFilterSection from "@/components/(common)/users-page/UsersFilterSection";
import UsersStatisticsSection from "@/components/(common)/users-page/UsersStatisticsSection";
import UserEditModal from "@/components/modals/UserEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import { closeEditModal, openEditModal } from "@/redux/slices/users-page-slice";
import type { RootState } from "@/redux/store";
import { deleteUser, fetchUsers } from "@/services/user.service";
import type { ErrorResponse } from "@/types/response.type";
import type { TUser } from "@/types/user.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete User");
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

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isVerified, setIsVerified] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setRole("");
    setStatus("");
    setIsVerified("");
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
    if (role) params.role = role;
    if (status) params.status = status;
    if (isVerified) params.is_verified = isVerified;

    return params;
  }, [search, sort, page, limit, gte, lte, role, status, isVerified]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => fetchUsers(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Users (Admin)" />
      <UsersStatisticsSection data={data?.data || []} meta={data?.meta} />
      <UsersFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        role={role}
        setRole={setRole}
        status={status}
        setStatus={setStatus}
        isVerified={isVerified}
        setIsVerified={setIsVerified}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <UsersDataTableSection
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
      <UserEditModal
        default={selectedUser || ({} as TUser)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedUser || ({} as TUser))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default UsersPage;
