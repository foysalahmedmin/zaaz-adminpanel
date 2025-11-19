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

const UserWalletsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedUserWallet } = useSelector(
    (state: RootState) => state.userWalletsPage,
  );

  const onOpenViewModal = (wallet: TUserWallet) => {
    dispatch(openViewModal(wallet));
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-wallets"],
    queryFn: () => fetchUserWallets({ sort: "-created_at" }),
  });

  return (
    <main className="space-y-6">
      <PageHeader name="User Wallets" />
      <UserWalletsStatisticsSection data={data?.data || []} />
      <Card>
        <Card.Content>
          <UserWalletsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
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

