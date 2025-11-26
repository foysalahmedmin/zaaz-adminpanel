import { Modal } from "@/components/ui/Modal";
import { fetchPackageHistories } from "@/services/package-history.service";
import type { TPackageHistory } from "@/types/package-history.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type PackageHistoryViewModalProps = {
  packageId: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const PackageHistoryViewModal: React.FC<PackageHistoryViewModalProps> = ({
  packageId,
  isOpen,
  setIsOpen,
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["package-histories", packageId],
    queryFn: () => fetchPackageHistories(packageId),
    enabled: isOpen && !!packageId,
  });

  const histories = data?.data || [];

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Package History</Modal.Title>
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
                {histories.map((history: TPackageHistory) => (
                  <div
                    key={history._id}
                    className="border-border rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{history.name}</h4>
                        {history.badge && (
                          <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                            {history.badge}
                          </span>
                        )}
                        {history.type && (
                          <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                            {history.type}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {history.created_at
                          ? new Date(history.created_at).toLocaleString()
                          : "N/A"}
                      </span>
                    </div>
                    {history.description && (
                      <p className="text-muted-foreground mb-2 text-sm">
                        {history.description}
                      </p>
                    )}
                    {history.points && history.points.length > 0 && (
                      <div className="mb-4">
                        <h5 className="mb-2 font-medium">Key Points:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {history.points.map((point, index) => (
                            <li
                              key={index}
                              className="text-muted-foreground text-sm"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Features Section */}
                    {history.features && history.features.length > 0 && (
                      <div className="mb-4">
                        <h5 className="mb-2 font-medium">Features:</h5>
                        <div className="space-y-1">
                          {history.features.map((feature) => (
                            <div
                              key={feature._id}
                              className="text-muted-foreground rounded bg-muted/50 px-2 py-1 text-sm"
                            >
                              <span className="font-medium">{feature.name}</span>
                              {feature.description && (
                                <span className="ml-2">
                                  - {feature.description}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Plans Section */}
                    {history.plans && history.plans.length > 0 && (
                      <div>
                        <h5 className="mb-2 font-medium">Plans:</h5>
                        <div className="space-y-2">
                          {history.plans.map((pp) => (
                            <div
                              key={pp._id}
                              className="border-border rounded border p-3"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <div>
                                  <span className="font-semibold">
                                    {pp.plan.name}
                                  </span>
                                  {pp.is_initial && (
                                    <span className="bg-primary/10 text-primary ml-2 rounded px-2 py-0.5 text-xs">
                                      Initial
                                    </span>
                                  )}
                                  {!pp.is_active && (
                                    <span className="bg-destructive/10 text-destructive ml-2 rounded px-2 py-0.5 text-xs">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                              </div>
                              {pp.plan.description && (
                                <p className="text-muted-foreground mb-2 text-sm">
                                  {pp.plan.description}
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Duration:</span>{" "}
                                  {pp.plan.duration} days
                                </div>
                                <div>
                                  <span className="font-medium">Tokens:</span>{" "}
                                  {pp.token}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Price (USD):
                                  </span>{" "}
                                  ${pp.price?.USD || 0}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Price (BDT):
                                  </span>{" "}
                                  ৳{pp.price?.BDT || 0}
                                </div>
                                {pp.previous_price && (
                                  <>
                                    <div>
                                      <span className="font-medium">
                                        Previous Price (USD):
                                      </span>{" "}
                                      ${pp.previous_price.USD || 0}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Previous Price (BDT):
                                      </span>{" "}
                                      ৳{pp.previous_price.BDT || 0}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!history.features || history.features.length === 0) &&
                      (!history.plans || history.plans.length === 0) && (
                        <div className="text-muted-foreground text-sm">
                          No features or plans in this history record.
                        </div>
                      )}
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

export default PackageHistoryViewModal;

