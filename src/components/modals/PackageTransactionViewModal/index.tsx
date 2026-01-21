import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TPackageTransaction } from "@/services/package-transaction.service";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type PackageTransactionViewModalProps = {
  default: Partial<TPackageTransaction>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const PackageTransactionViewModal: React.FC<
  PackageTransactionViewModalProps
> = ({ isOpen, setIsOpen, default: transaction }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!transaction._id) return;

    try {
      await navigator.clipboard.writeText(transaction._id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  const getPackageName = () => {
    if (!transaction.package) return "N/A";
    if (typeof transaction.package === "string") return transaction.package;
    return (transaction.package as any).name || "N/A";
  };

  const getPlanName = () => {
    if (!transaction.plan) return "N/A";
    if (typeof transaction.plan === "string") return transaction.plan;
    return (transaction.plan as any).name || "N/A";
  };

  const getUserInfo = () => {
    if (transaction.email) return transaction.email;
    if (!transaction.user) return "N/A";
    if (typeof transaction.user === "string") return transaction.user;
    return (
      (transaction.user as any).email || (transaction.user as any).name || "N/A"
    );
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Package Transaction Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Package</span>
                <p className="font-semibold">{getPackageName()}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Plan</span>
                <p className="font-semibold">{getPlanName()}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Credits Added
                </span>
                <p className="font-bold text-green-600">
                  +{transaction.credits} credits
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Increase Source
                </span>
                <p className="text-sm font-semibold capitalize">
                  {transaction.increase_source}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">User</span>
                <p className="text-sm font-semibold">{getUserInfo()}</p>
              </div>
              {transaction.payment_transaction && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Payment ID
                  </span>
                  <p className="font-mono text-sm break-all">
                    {typeof transaction.payment_transaction === "string"
                      ? transaction.payment_transaction
                      : (transaction.payment_transaction as any)._id || "N/A"}
                  </p>
                </div>
              )}
              {transaction.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Date</span>
                  <p className="text-sm">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p className="text-sm">
                  {transaction.is_deleted ? (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800">
                      Deleted
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Active
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Document ID Section at Bottom */}
            {transaction._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Transaction Record ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                        {transaction._id}
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PackageTransactionViewModal;
