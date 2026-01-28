import CouponsDataTableSection from "@/components/(common)/coupons-page/CouponsDataTableSection";
import CouponsFilterSection from "@/components/(common)/coupons-page/CouponsFilterSection";
import CouponsStatisticsSection from "@/components/(common)/coupons-page/CouponsStatisticsSection";
import CouponAddModal from "@/components/modals/CouponAddModal";
import CouponEditModal from "@/components/modals/CouponEditModal";
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
} from "@/redux/slices/coupons-page-slice";
import type { RootState } from "@/redux/store";
import { deleteCoupon, fetchCoupons } from "@/services/coupon.service";
import type { TCoupon } from "@/types/coupon.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const CouponsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { isAddModalOpen, isEditModalOpen, selectedCoupon } = useSelector(
    (state: RootState) => state.couponsPage,
  );

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (coupon: TCoupon) => {
    dispatch(openEditModal(coupon));
  };

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteCoupon(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Coupon deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    },
  });

  const onDelete = async (coupon: TCoupon) => {
    const ok = await confirm({
      title: "Delete Coupon",
      message: `Are you sure you want to delete coupon "${coupon.code}"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(coupon._id);
    }
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [status, setStatus] = useState<string>("");

  const resetFilters = () => {
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
    if (status) params.is_active = status === "active" ? "true" : "false";

    return params;
  }, [search, sort, page, limit, status]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["coupons", queryParams],
    queryFn: () => fetchCoupons(queryParams),
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
        name="Coupons"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Coupon
          </Button>
        }
      />
      <CouponsStatisticsSection meta={data?.meta} />
      <CouponsFilterSection
        status={status}
        setStatus={setStatus}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <CouponsDataTableSection
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
      <CouponAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <CouponEditModal
        default={selectedCoupon || ({} as TCoupon)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedCoupon || ({} as TCoupon))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default CouponsPage;
