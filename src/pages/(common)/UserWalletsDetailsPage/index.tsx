import UserWalletViewModal from "@/components/modals/UserWalletViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/user-wallets-page-slice";
import type { RootState } from "@/redux/store";
import { fetchUserWalletById } from "@/services/user-wallet.service";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const UserWalletsDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const wallet = (location.state as { wallet?: any })?.wallet;

  const { isViewModalOpen, selectedUserWallet } = useSelector(
    (state: RootState) => state.userWalletsPage,
  );

  const { data, isLoading } = useQuery({
    queryKey: ["user-wallet", id],
    queryFn: () => fetchUserWalletById(id || ""),
    enabled: !!id,
  });

  const currentWallet = data?.data || wallet;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentWallet) {
    return <div>Wallet not found</div>;
  }

  return (
    <main className="space-y-6">
      <PageHeader name={`User Wallet: ${id}`} />
      <Card>
        <Card.Content>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Wallet Information</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">User:</span>{" "}
                  {typeof currentWallet.user === "object" && currentWallet.user
                    ? (currentWallet.user as any).name ||
                      (currentWallet.user as any).email
                    : currentWallet.user}
                </p>
                <p>
                  <span className="font-medium">Package:</span>{" "}
                  {typeof currentWallet.package === "object" &&
                  currentWallet.package
                    ? (currentWallet.package as any).name
                    : currentWallet.package}
                </p>
                <p>
                  <span className="font-medium">Tokens:</span>{" "}
                  {currentWallet.token}
                </p>
                {currentWallet.expires_at && (
                  <p>
                    <span className="font-medium">Expires At:</span>{" "}
                    {new Date(currentWallet.expires_at).toLocaleString()}
                  </p>
                )}
                {currentWallet.created_at && (
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(currentWallet.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
      <UserWalletViewModal
        default={currentWallet}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(currentWallet)
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default UserWalletsDetailsPage;

