import { Modal } from "@/components/ui/Modal";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import React from "react";

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
                  {transaction.amount} tokens
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
                    {transaction.decrease_source}
                  </p>
                </div>
              )}
              {transaction.payment_transaction && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Payment Transaction
                  </span>
                  <p className="font-mono text-sm">
                    {transaction.payment_transaction}
                  </p>
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

