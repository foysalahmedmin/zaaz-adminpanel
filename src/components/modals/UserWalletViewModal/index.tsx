import { Modal } from "@/components/ui/Modal";
import type { TUserWallet } from "@/types/user-wallet.type";
import React from "react";

type UserWalletViewModalProps = {
  default: Partial<TUserWallet>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const UserWalletViewModal: React.FC<UserWalletViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: wallet,
}) => {
  const isExpired =
    wallet.expires_at && new Date(wallet.expires_at) < new Date();

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>User Wallet Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">User</span>
                <p className="font-semibold">
                  {typeof wallet.user === "object" && wallet.user
                    ? (wallet.user as any).name ||
                      (wallet.user as any).email
                    : wallet.user}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Package</span>
                <p className="font-semibold">
                  {typeof wallet.package === "object" && wallet.package
                    ? (wallet.package as any).name
                    : wallet.package}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Tokens</span>
                <p className="font-semibold text-lg">{wallet.token || 0}</p>
              </div>
              {wallet.expires_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Expires At</span>
                  <p
                    className={`text-sm font-semibold ${
                      isExpired ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {new Date(wallet.expires_at).toLocaleString()}
                    {isExpired && " (Expired)"}
                  </p>
                </div>
              )}
              {wallet.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Created At</span>
                  <p className="text-sm">
                    {new Date(wallet.created_at).toLocaleString()}
                  </p>
                </div>
              )}
              {wallet.updated_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Updated At</span>
                  <p className="text-sm">
                    {new Date(wallet.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default UserWalletViewModal;

