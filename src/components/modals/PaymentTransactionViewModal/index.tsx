import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type PaymentTransactionViewModalProps = {
  default: Partial<TPaymentTransaction>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const PaymentTransactionViewModal: React.FC<
  PaymentTransactionViewModalProps
> = ({ isOpen, setIsOpen, default: transaction }) => {
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Payment Transaction Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Transaction ID</span>
                <p className="font-mono text-sm font-semibold">
                  {transaction.gateway_transaction_id}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(
                      transaction.status,
                    )}`}
                  >
                    {transaction.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Amount</span>
                <p className="font-semibold">
                  {transaction.currency === "USD" ? "$" : "৳"}
                  {transaction.amount} {transaction.currency}
                </p>
              </div>
              {transaction.gateway_fee && (
                <div>
                  <span className="text-muted-foreground text-sm">Gateway Fee</span>
                  <p className="font-semibold">
                    {transaction.currency === "USD" ? "$" : "৳"}
                    {transaction.gateway_fee}
                  </p>
                </div>
              )}
              {transaction.gateway_session_id && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Session ID</span>
                  <p className="font-mono text-sm">
                    {transaction.gateway_session_id}
                  </p>
                </div>
              )}
              {transaction.gateway_status && (
                <div>
                  <span className="text-muted-foreground text-sm">Gateway Status</span>
                  <p className="text-sm">{transaction.gateway_status}</p>
                </div>
              )}
              {transaction.customer_email && (
                <div>
                  <span className="text-muted-foreground text-sm">Customer Email</span>
                  <p className="text-sm">{transaction.customer_email}</p>
                </div>
              )}
              {transaction.customer_name && (
                <div>
                  <span className="text-muted-foreground text-sm">Customer Name</span>
                  <p className="text-sm">{transaction.customer_name}</p>
                </div>
              )}
              {transaction.paid_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Paid At</span>
                  <p className="text-sm">
                    {new Date(transaction.paid_at).toLocaleString()}
                  </p>
                </div>
              )}
              {transaction.failed_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Failed At</span>
                  <p className="text-sm">
                    {new Date(transaction.failed_at).toLocaleString()}
                  </p>
                </div>
              )}
              {transaction.refunded_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Refunded At</span>
                  <p className="text-sm">
                    {new Date(transaction.refunded_at).toLocaleString()}
                  </p>
                </div>
              )}
              {transaction.failure_reason && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">Failure Reason</span>
                  <p className="text-sm text-red-600">
                    {transaction.failure_reason}
                  </p>
                </div>
              )}
              {transaction.refund_id && (
                <div>
                  <span className="text-muted-foreground text-sm">Refund ID</span>
                  <p className="font-mono text-sm">{transaction.refund_id}</p>
                </div>
              )}
              {transaction.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">Created At</span>
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

export default PaymentTransactionViewModal;

