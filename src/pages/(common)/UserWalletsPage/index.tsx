import UserWalletsDataTableSection from "@/components/(common)/user-wallets-page/UserWalletsDataTableSection";
import UserWalletsStatisticsSection from "@/components/(common)/user-wallets-page/UserWalletsStatisticsSection";
import UserWalletViewModal from "@/components/modals/UserWalletViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/user-wallets-page-slice";
import type { RootState } from "@/redux/store";
import { fetchUserWallets } from "@/services/user-wallet.service";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useState, useMemo, useEffect } from "react";

const UserWalletsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedUserWallet } = useSelector(
    (state: RootState) => state.userWalletsPage,
  );

  const onOpenViewModal = (wallet: TUserWallet) => {
    dispatch(openViewModal(wallet));
  };

  // State management for search, sort, pagination
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Build query parameters from state
  const queryParams = useMemo(() => {
    const params: Record<string, any> = {
      page,
      limit,
    };

    if (sort) {
      params.sort = sort;
    }

    if (search) {
      params.search = search;
    }

    return params;
  }, [search, sort, page, limit]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-wallets", queryParams],
    queryFn: () => fetchUserWallets(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    } else if (data?.data) {
      setTotal(data.data.length);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="User Wallets" />
      <UserWalletsStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <Card>
        <Card.Content>
          <UserWalletsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
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
      <UserWalletViewModal
        default={selectedUserWallet || ({} as TUserWallet)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedUserWallet || ({} as TUserWallet))
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default UserWalletsPage;

