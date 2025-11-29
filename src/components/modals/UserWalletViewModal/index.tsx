import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TUserWallet } from "@/types/user-wallet.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

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
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!wallet._id) return;

    try {
      await navigator.clipboard.writeText(wallet._id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy ID");
    }
  };

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

            {/* Document ID Section at Bottom */}
            {wallet._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Document ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                        {wallet._id}
                      </p>
                      <Button
                        onClick={handleCopyId}
                        size="sm"
                        variant="outline"
                        shape="icon"
                        className="flex-shrink-0"
                        title="Copy ID"
                      >
                        {copied ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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

