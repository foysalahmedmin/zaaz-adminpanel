import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { TPlan } from "@/types/plan.type";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type PlanViewModalProps = {
  default: Partial<TPlan>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const PlanViewModal: React.FC<PlanViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: plan,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!plan._id) return;

    try {
      await navigator.clipboard.writeText(plan._id);
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
            <Modal.Title>Plan Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Name</span>
                <p className="font-semibold">{plan.name || "N/A"}</p>
              </div>
              {plan.description && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm">
                    Description
                  </span>
                  <p className="text-sm">{plan.description}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground text-sm">
                  Duration (Days)
                </span>
                <p className="font-semibold text-lg">
                  {plan.duration?.toString() || "0"}
                </p>
              </div>
              {plan.sequence !== undefined && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Sequence
                  </span>
                  <p className="font-semibold">
                    {plan.sequence.toString() || "0"}
                  </p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground text-sm">Status</span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      plan.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {plan.is_active ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
              {plan.created_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Created At
                  </span>
                  <p className="text-sm">
                    {new Date(plan.created_at).toLocaleString()}
                  </p>
                </div>
              )}
              {plan.updated_at && (
                <div>
                  <span className="text-muted-foreground text-sm">
                    Updated At
                  </span>
                  <p className="text-sm">
                    {new Date(plan.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Document ID Section at Bottom */}
            {plan._id && (
              <div className="mt-6 border-t pt-4">
                <div className="min-w-0 flex-1">
                  <span className="text-muted-foreground mb-1 block text-sm">
                    Document ID
                  </span>
                  <div className="flex items-center gap-2">
                    <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                      {plan._id}
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

export default PlanViewModal;

