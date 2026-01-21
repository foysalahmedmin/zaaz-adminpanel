import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { TPaymentMethod } from "@/types/payment-method.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type PaymentMethodViewModalProps = {
  default: Partial<TPaymentMethod>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const PaymentMethodViewModal: React.FC<PaymentMethodViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: paymentMethod,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!paymentMethod._id) return;

    try {
      await navigator.clipboard.writeText(paymentMethod._id);
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
            <Modal.Title>Payment Method Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Name</span>
                <p className="font-semibold">{paymentMethod.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Value</span>
                <p className="font-mono text-sm font-semibold">
                  {paymentMethod.value || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Currency</span>
                <p className="font-semibold uppercase">
                  {paymentMethod.currency || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Sequence</span>
                <p className="font-semibold">
                  {paymentMethod.sequence?.toString() || "0"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Test Mode</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      paymentMethod.is_test
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800",
                    )}
                  >
                    {paymentMethod.is_test ? "Test" : "Live"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      paymentMethod.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {paymentMethod.is_active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              {paymentMethod.description && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">
                    Description
                  </span>
                  <p className="text-sm">{paymentMethod.description}</p>
                </div>
              )}
              {paymentMethod.currencies &&
                paymentMethod.currencies.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-sm">
                      Supported Currencies
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {paymentMethod.currencies.map((currency, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium uppercase"
                        >
                          {currency}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              {paymentMethod.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Created At
                  </span>
                  <p className="text-sm">
                    {new Date(paymentMethod.created_at).toLocaleString()}
                  </p>
                </div>
              )}
              {paymentMethod.updated_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Updated At
                  </span>
                  <p className="text-sm">
                    {new Date(paymentMethod.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Document ID Section at Bottom */}
            {paymentMethod._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Document ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                        {paymentMethod._id}
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

export default PaymentMethodViewModal;
