import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { TCreditsUsage } from "@/types/credits-usage.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type CreditsUsageViewModalProps = {
  default: Partial<TCreditsUsage>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CreditsUsageViewModal: React.FC<CreditsUsageViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: usage,
}) => {
  const [copied, setCopied] = useState(false);

  // Helper function to safely extract ID from a field that might be populated
  const extractId = (
    field: string | { _id: string } | null | undefined,
  ): string => {
    if (!field) return "N/A";
    if (typeof field === "string") return field;
    return field._id || "N/A";
  };

  const handleCopyId = async () => {
    if (!usage._id) return;

    try {
      await navigator.clipboard.writeText(usage._id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Credits Usage Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Usage Key</span>
                <p className="bg-muted/50 rounded p-1 font-mono text-xs">
                  {usage.usage_key}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">AI Model</span>
                <p className="font-semibold capitalize">
                  {usage.ai_model || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">User</span>
                <p className="text-sm font-semibold">{usage.email || "N/A"}</p>
                <p className="text-muted-foreground text-[10px]">
                  User ID: {extractId(usage.user)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Total Usage Cost
                </span>
                <p className="font-semibold text-red-600">
                  {usage.credits?.toFixed(4) || 0} credits
                </p>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 border-t pt-2">
                <div>
                  <span className="text-muted-foreground text-sm">
                    Input Tokens
                  </span>
                  <p className="text-sm font-semibold">
                    {usage.input_tokens || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Output Tokens
                  </span>
                  <p className="text-sm font-semibold">
                    {usage.output_tokens || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase">
                    In Token Price
                  </span>
                  <p className="text-xs font-semibold">
                    ${usage.input_token_price?.toFixed(8) || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-[10px] uppercase">
                    Out Token Price
                  </span>
                  <p className="text-xs font-semibold">
                    ${usage.output_token_price?.toFixed(8) || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Input Credits
                  </span>
                  <p className="text-sm font-semibold">
                    {usage.input_credits || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Output Credits
                  </span>
                  <p className="text-sm font-semibold">
                    {usage.output_credits || 0}
                  </p>
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4 border-t pt-2">
                <div>
                  <span className="text-muted-foreground text-sm">
                    Profit Margin (%)
                  </span>
                  <p className="text-sm font-semibold text-green-600">
                    {usage.profit_credits_percentage || 0}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Profit Credits
                  </span>
                  <p className="text-sm font-semibold text-green-600">
                    {usage.profit_credits || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Production Cost (Credits)
                  </span>
                  <p className="text-sm font-semibold text-red-600">
                    {usage.cost_credits || 0}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">
                    Production Cost (USD)
                  </span>
                  <p className="text-sm font-semibold">
                    ${usage.cost_price?.toFixed(6) || 0}
                  </p>
                </div>
                <div className="mt-2 border-t pt-2">
                  <span className="text-muted-foreground text-sm">
                    Rounding Surplus
                  </span>
                  <p className="text-sm font-semibold text-blue-600">
                    {usage.rounding_credits || 0} credits
                  </p>
                </div>
                <div className="mt-2 border-t pt-2">
                  <span className="text-muted-foreground text-sm">
                    Rounding Value (USD)
                  </span>
                  <p className="text-sm font-semibold text-blue-600">
                    ${usage.rounding_price?.toFixed(6) || 0}
                  </p>
                </div>
              </div>

              {usage.credits_transaction && (
                <div className="col-span-2 border-t pt-2">
                  <span className="text-muted-foreground text-sm">
                    Credits Transaction ID
                  </span>
                  <p className="font-mono text-xs">
                    {extractId(usage.credits_transaction)}
                  </p>
                </div>
              )}

              {usage.created_at && (
                <div className="col-span-2 border-t pt-2">
                  <span className="text-muted-foreground text-sm">Used At</span>
                  <p className="text-sm italic">
                    {new Date(usage.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {usage._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Log ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-[10px] break-all">
                        {usage._id}
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

export default CreditsUsageViewModal;
