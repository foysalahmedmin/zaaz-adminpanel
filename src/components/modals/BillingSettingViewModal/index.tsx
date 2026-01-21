import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { TBillingSetting } from "@/types/billing-setting.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type BillingSettingViewModalProps = {
  default: Partial<TBillingSetting>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const BillingSettingViewModal: React.FC<BillingSettingViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: setting,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!setting._id) return;

    try {
      await navigator.clipboard.writeText(setting._id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy ID");
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Billing Setting Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">
                  Credit Price
                </span>
                <p className="font-semibold">${setting.credit_price || "0"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Currency</span>
                <p className="font-semibold">{setting.currency || "USD"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      setting.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800",
                    )}
                  >
                    {setting.status === "active" ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Applied At
                </span>
                <p className="font-semibold">
                  {setting.applied_at
                    ? new Date(setting.applied_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Is Active</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      setting.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {setting.is_active ? "Yes" : "No"}
                  </span>
                </p>
              </div>
              {setting.is_initial && (
                <div>
                  <span className="text-muted-foreground text-sm">Initial</span>
                  <p>
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                      Yes
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Document ID Section at Bottom */}
            {setting._id && (
              <div className="mt-6 border-t pt-4">
                <div className="min-w-0 flex-1">
                  <span className="text-muted-foreground mb-1 block text-sm">
                    Document ID
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                      {setting._id}
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
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default BillingSettingViewModal;
