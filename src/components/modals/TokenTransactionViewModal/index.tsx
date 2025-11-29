import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type TokenTransactionViewModalProps = {
  default: Partial<TTokenTransaction>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const TokenTransactionViewModal: React.FC<TokenTransactionViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: transaction,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!transaction._id) return;

    try {
      await navigator.clipboard.writeText(transaction._id);
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
            <Modal.Title>Token Transaction Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Type</span>
                <p className="font-semibold capitalize">{transaction.type}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Amount</span>
                <p
                  className={`font-semibold ${
                    transaction.type === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "increase" ? "+" : "-"}
                  {transaction.token} tokens
                </p>
              </div>
              {transaction.increase_source && (
                <div>
                  <span className="text-muted-foreground text-sm">Source</span>
                  <p className="text-sm capitalize">
                    {transaction.increase_source}
                  </p>
                </div>
              )}
              {transaction.decrease_source && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Feature Endpoint
                  </span>
                  <p className="font-mono text-sm">
                    {typeof transaction.decrease_source === "string"
                      ? transaction.decrease_source
                      : typeof transaction.decrease_source === "object" &&
                          transaction.decrease_source !== null
                        ? (transaction.decrease_source as any).name ||
                          (transaction.decrease_source as any).endpoint ||
                          (transaction.decrease_source as any)._id ||
                          "N/A"
                        : "N/A"}
                  </p>
                </div>
              )}
              {transaction.payment_transaction && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Payment Transaction
                  </span>
                  <p className="font-mono text-sm">
                    {typeof transaction.payment_transaction === "string"
                      ? transaction.payment_transaction
                      : typeof transaction.payment_transaction === "object" &&
                          transaction.payment_transaction !== null
                        ? (transaction.payment_transaction as any)._id ||
                          (transaction.payment_transaction as any)
                            .gateway_transaction_id ||
                          "N/A"
                        : "N/A"}
                  </p>
                </div>
              )}
              {transaction.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Created At
                  </span>
                  <p className="text-sm">
                    {new Date(transaction.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Document ID Section at Bottom */}
            {transaction._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Document ID
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

export default TokenTransactionViewModal;
