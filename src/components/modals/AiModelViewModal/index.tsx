import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { TAiModel } from "@/types/ai-model.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type AiModelViewModalProps = {
  default: Partial<TAiModel>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const AiModelViewModal: React.FC<AiModelViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: aiModel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!aiModel._id) return;

    try {
      await navigator.clipboard.writeText(aiModel._id);
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
            <Modal.Title>AI Model Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Name</span>
                <p className="font-semibold">{aiModel.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Value</span>
                <p className="font-semibold">{aiModel.value || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Provider</span>
                <p className="font-semibold">{aiModel.provider || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Currency</span>
                <p className="font-semibold">{aiModel.currency || "USD"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Input Token Price
                </span>
                <p className="font-semibold">
                  ${aiModel.input_token_price || "0"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">
                  Output Token Price
                </span>
                <p className="font-semibold">
                  ${aiModel.output_token_price || "0"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      aiModel.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {aiModel.is_active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              {aiModel.is_initial && (
                <div>
                  <span className="text-muted-foreground text-sm">Initial</span>
                  <p>
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
                      Yes
                    </span>
                  </p>
                </div>
              )}
              {aiModel.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Created At
                  </span>
                  <p className="text-sm">
                    {new Date(aiModel.created_at).toLocaleString()}
                  </p>
                </div>
              )}
              {aiModel.updated_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Updated At
                  </span>
                  <p className="text-sm">
                    {new Date(aiModel.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Document ID Section at Bottom */}
            {aiModel._id && (
              <div className="mt-6 border-t pt-4">
                <div className="min-w-0 flex-1">
                  <span className="text-muted-foreground mb-1 block text-sm">
                    Document ID
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                      {aiModel._id}
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

export default AiModelViewModal;
