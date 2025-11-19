import { Modal } from "@/components/ui/Modal";
import { fetchTokenProfitHistories } from "@/services/token-profit-history.service";
import type { TTokenProfitHistory } from "@/types/token-profit-history.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type TokenProfitHistoryViewModalProps = {
  tokenProfitId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const TokenProfitHistoryViewModal: React.FC<
  TokenProfitHistoryViewModalProps
> = ({ tokenProfitId, isOpen, setIsOpen }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["token-profit-histories", tokenProfitId],
    queryFn: () => fetchTokenProfitHistories(tokenProfitId),
    enabled: isOpen && !!tokenProfitId,
  });

  const histories = data?.data || [];

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Token Profit History</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading history...</div>
              </div>
            ) : histories.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">No history found</div>
              </div>
            ) : (
              <div className="space-y-4">
                {histories.map((history: TTokenProfitHistory) => (
                  <div
                    key={history._id}
                    className="border-border rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-semibold">{history.name}</h4>
                      <span className="text-muted-foreground text-sm">
                        {history.created_at
                          ? new Date(history.created_at).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Percentage:</span>{" "}
                        {history.percentage}%
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        {history.is_active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>
                ))}
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

export default TokenProfitHistoryViewModal;

