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
    } catch {
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
        <Modal.Content className="max-w-3xl">
          <Modal.Header>
            <Modal.Title>Payment Transaction Full Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="max-h-[70vh] space-y-6 overflow-y-auto pr-2">
            {/* Status & ID Summary */}
            <div className="bg-muted/30 grid grid-cols-2 gap-4 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground text-xs tracking-wider uppercase">
                  Transaction ID
                </span>
                <p className="font-mono text-sm font-bold">
                  {transaction.gateway_transaction_id || "NOT-SET-YET"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs tracking-wider uppercase">
                  System Status
                </span>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${getStatusColor(
                    transaction.status,
                  )}`}
                >
                  {transaction.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Financial Information */}
              <div className="space-y-4">
                <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                  Financial Info
                </h4>
                <div className="grid grid-cols-2 gap-y-3">
                  {transaction.discount_amount &&
                  transaction.discount_amount > 0 ? (
                    <>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-xs">
                          Original Price
                        </span>
                        <p className="text-lg font-semibold text-gray-500 line-through">
                          {transaction.currency === "USD" ? "$" : "৳"}
                          {(
                            (transaction.amount || 0) +
                            transaction.discount_amount
                          ).toFixed(2)}{" "}
                          {transaction.currency}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-xs">
                          Discount Applied
                        </span>
                        <p className="text-lg font-bold text-green-600">
                          - {transaction.currency === "USD" ? "$" : "৳"}
                          {transaction.discount_amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="col-span-2 border-t pt-2">
                        <span className="text-muted-foreground text-xs">
                          Final Amount Paid
                        </span>
                        <p className="text-primary text-2xl font-bold">
                          {transaction.currency === "USD" ? "$" : "৳"}
                          {transaction.amount} {transaction.currency}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2">
                      <span className="text-muted-foreground text-xs">
                        Amount
                      </span>
                      <p className="text-lg font-bold">
                        {transaction.currency === "USD" ? "$" : "৳"}
                        {transaction.amount} {transaction.currency}
                      </p>
                    </div>
                  )}
                  <div className="col-span-1">
                    <span className="text-muted-foreground text-xs">
                      Gateway Fee
                    </span>
                    <p className="font-semibold text-red-500">
                      {transaction.gateway_fee ? (
                        <>
                          {transaction.currency === "USD" ? "$" : "৳"}
                          {transaction.gateway_fee}
                        </>
                      ) : (
                        "0.00"
                      )}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <span className="text-muted-foreground text-xs">
                      Payment Method
                    </span>
                    <p className="text-sm font-medium">
                      {typeof transaction.payment_method === "object"
                        ? transaction.payment_method.name
                        : transaction.payment_method || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package & Plan Information */}
              <div className="space-y-4">
                <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                  Product Details
                </h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                  <div className="col-span-1">
                    <span className="text-muted-foreground text-xs">
                      Package
                    </span>
                    <p className="font-semibold">
                      {typeof transaction.package === "object"
                        ? transaction.package.name
                        : "N/A"}
                    </p>
                  </div>
                  <div className="col-span-1">
                    <span className="text-muted-foreground text-xs">Plan</span>
                    <p className="font-semibold">
                      {typeof transaction.plan === "object"
                        ? transaction.plan.name
                        : "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-xs">
                      Included Credits
                    </span>
                    <p className="font-bold text-green-600">
                      {typeof transaction.price === "object"
                        ? `${transaction.price.credits} credits`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon & Discount Information */}
              {transaction.coupon && (
                <div className="space-y-4">
                  <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                    Coupon & Discount
                  </h4>
                  <div className="space-y-3 rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-950/20 dark:to-emerald-950/20">
                    <div>
                      <span className="text-muted-foreground text-xs">
                        Coupon Code
                      </span>
                      <p className="font-mono text-lg font-bold text-green-700 dark:text-green-400">
                        {typeof transaction.coupon === "object"
                          ? transaction.coupon.code
                          : "N/A"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Discount Type
                        </span>
                        <p className="font-semibold capitalize">
                          {typeof transaction.coupon === "object"
                            ? transaction.coupon.discount_type
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Discount Value
                        </span>
                        <p className="font-bold text-green-600 dark:text-green-400">
                          {typeof transaction.coupon === "object" &&
                          transaction.coupon.discount_type === "percentage"
                            ? `${transaction.coupon.discount_value}%`
                            : typeof transaction.coupon === "object"
                              ? `${transaction.currency === "USD" ? "$" : "৳"}${transaction.coupon.discount_value}`
                              : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-green-200 pt-3 dark:border-green-800">
                      <span className="text-muted-foreground text-xs">
                        Total Discount Applied
                      </span>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {transaction.discount_amount
                          ? `${transaction.currency === "USD" ? "$" : "৳"}${transaction.discount_amount.toFixed(2)}`
                          : "৳0.00"}
                      </p>
                    </div>
                    {typeof transaction.coupon === "object" &&
                      transaction.coupon.is_affiliate && (
                        <div className="rounded border border-blue-300 bg-blue-100 px-3 py-2 dark:border-blue-700 dark:bg-blue-900/30">
                          <span className="text-xs font-bold text-blue-700 uppercase dark:text-blue-300">
                            🎯 Affiliate Coupon
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                  Customer Info
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Customer Name
                    </span>
                    <p className="font-medium">
                      {transaction.customer_name || "Guest User"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Wallet Email
                    </span>
                    <p className="font-semibold text-blue-600 underline">
                      {transaction.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">
                      Gateway Billing Email
                    </span>
                    <p className="text-sm">
                      {transaction.customer_email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="space-y-4">
                <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                  Time Log
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initiated:</span>
                    <span className="font-medium">
                      {transaction.created_at
                        ? new Date(transaction.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-bold text-green-600">
                      {transaction.paid_at
                        ? new Date(transaction.paid_at).toLocaleString()
                        : "PENDING"}
                    </span>
                  </div>
                  {transaction.failed_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-xs font-bold text-red-500 uppercase">
                        Failed:
                      </span>
                      <span className="font-bold text-red-500">
                        {new Date(transaction.failed_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {transaction.refunded_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-xs font-bold text-blue-500 uppercase">
                        Refunded:
                      </span>
                      <span className="font-bold text-blue-500">
                        {new Date(transaction.refunded_at).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gateway Metadata */}
            <div className="space-y-4">
              <h4 className="border-primary/20 text-primary border-b pb-1 text-sm font-bold tracking-widest uppercase">
                Gateway Metadata
              </h4>
              <div className="bg-muted/20 grid grid-cols-1 gap-4 rounded-lg p-3 md:grid-cols-2">
                <div>
                  <span className="text-muted-foreground text-xs">
                    Gateway Status
                  </span>
                  <p className="font-mono text-sm">
                    {transaction.gateway_status || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">
                    Session ID
                  </span>
                  <p className="font-mono text-xs break-all">
                    {transaction.gateway_session_id || "N/A"}
                  </p>
                </div>
                {transaction.refund_id && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-xs">
                      Refund Tracker ID
                    </span>
                    <p className="font-mono text-sm">{transaction.refund_id}</p>
                  </div>
                )}
                {transaction.failure_reason && (
                  <div className="col-span-2 border-t border-red-200 pt-2">
                    <span className="text-xs font-bold text-red-500 uppercase">
                      Error Log
                    </span>
                    <p className="text-sm text-red-600">
                      {transaction.failure_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Development / Tech Info */}
            <details className="group mt-4">
              <summary className="text-muted-foreground hover:text-primary cursor-pointer text-xs font-bold tracking-widest uppercase transition-colors">
                Technical Data (JSON)
              </summary>
              <div className="bg-muted mt-2 rounded p-3">
                <pre className="max-h-40 overflow-y-auto font-mono text-[10px]">
                  {JSON.stringify(transaction.gateway_response, null, 2) ||
                    "No metadata recorded."}
                </pre>
              </div>
            </details>

            {/* Document ID Section at Bottom */}
            {transaction._id && (
              <div className="border-border/50 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-xs font-bold uppercase">
                      System Database ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-[10px] break-all">
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
              className="border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md border px-6 py-2 text-sm font-bold transition-all active:scale-95"
            >
              Close Details
            </button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PaymentTransactionViewModal;
