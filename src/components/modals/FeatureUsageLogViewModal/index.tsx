import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import type { TFeatureUsageLog } from "@/types/feature-usage-log.type";
import { Check, Copy, FileJson } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

type FeatureUsageLogViewModalProps = {
  default: Partial<TFeatureUsageLog>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const FeatureUsageLogViewModal: React.FC<FeatureUsageLogViewModalProps> = ({
  isOpen,
  setIsOpen,
  default: log,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    if (!log._id) return;

    try {
      await navigator.clipboard.writeText(log._id);
      setCopied(true);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy ID");
    }
  };

  let endpoint: any = log.feature_endpoint;
  if (Array.isArray(endpoint) && endpoint.length > 0) {
    endpoint = endpoint[0];
  }
  // Ensure it's an object if not null
  if (endpoint && typeof endpoint !== "object") {
    endpoint = null;
  }

  let feature: any = endpoint?.feature;
  if (Array.isArray(feature) && feature.length > 0) {
    feature = feature[0];
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Feature Usage Log Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Feature
                </span>
                <p className="text-sm font-bold uppercase">
                  {feature?.name || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Endpoint Name
                </span>
                <p className="text-sm font-semibold">
                  {endpoint?.name || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  HTTP Method
                </span>
                <p>
                  <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-bold uppercase">
                    {log.method || endpoint?.method || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Status
                </span>
                <p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      log.status === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800",
                    )}
                  >
                    {log.status}
                  </span>
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground text-sm font-medium">
                  Endpoint URL
                </span>
                <p className="mt-0.5 font-mono text-xs break-all">
                  {log.endpoint || endpoint?.endpoint || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Response Code
                </span>
                <p className="font-mono text-sm">{log.code}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  User Email
                </span>
                <p className="truncate text-sm">{log.email || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm font-medium">
                  Timestamp
                </span>
                <p className="text-sm">
                  {log.created_at
                    ? new Date(log.created_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
              {log.usage_key && (
                <div className="col-span-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    Usage Key
                  </span>
                  <p className="bg-muted mt-0.5 inline-block rounded-md px-2 py-1 font-mono text-xs">
                    {log.usage_key}
                  </p>
                </div>
              )}
            </div>

            {/* JSON Data Sections */}
            <div className="space-y-4 border-t pt-6">
              <h4 className="text-foreground flex items-center gap-2 text-base font-semibold">
                <FileJson className="h-4 w-4" /> Request & Response Data
              </h4>

              <div className="space-y-4">
                {log.params && Object.keys(log.params).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Path Parameters
                    </span>
                    <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
                      {JSON.stringify(log.params, null, 2)}
                    </pre>
                  </div>
                )}

                {log.query && Object.keys(log.query).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Query Parameters
                    </span>
                    <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
                      {JSON.stringify(log.query, null, 2)}
                    </pre>
                  </div>
                )}

                {log.payload && Object.keys(log.payload).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Payload
                    </span>
                    <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
                      {JSON.stringify(log.payload, null, 2)}
                    </pre>
                  </div>
                )}

                {log.response && Object.keys(log.response).length > 0 && (
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold uppercase">
                      Response
                    </span>
                    <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
                      {JSON.stringify(log.response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Document ID Section at Bottom */}
            {log._id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Document ID
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="bg-muted/50 flex-1 rounded px-2 py-1.5 font-mono text-xs break-all">
                        {log._id}
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

export default FeatureUsageLogViewModal;
