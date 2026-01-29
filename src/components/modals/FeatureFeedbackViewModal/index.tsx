import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { setIsViewModalOpen } from "@/redux/slices/feature-feedbacks-page-slice";
import type { RootState } from "@/redux/store";
import { updateFeatureFeedback } from "@/services/feature-feedback.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FeatureFeedbackViewModal = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { selectedFeedback, isViewModalOpen } = useSelector(
    (state: RootState) => state.featureFeedbacksPage,
  );

  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (selectedFeedback) {
      setAdminNote(selectedFeedback.admin_note || "");
    }
  }, [selectedFeedback]);

  const onClose = () => dispatch(setIsViewModalOpen(false));

  const update_mutation = useMutation({
    mutationFn: (payload: { status?: string; admin_note?: string }) => {
      if (!selectedFeedback) throw new Error("No feedback selected");
      return updateFeatureFeedback(selectedFeedback._id, payload);
    },
    onSuccess: () => {
      toast.success("Feedback updated successfully");
      queryClient.invalidateQueries({ queryKey: ["feature-feedbacks"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update feedback");
    },
  });

  if (!selectedFeedback) return null;

  const handleUpdate = (status?: string) => {
    update_mutation.mutate({
      status: status || selectedFeedback.status,
      admin_note: adminNote,
    });
  };

  const statusConfig: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600",
    reviewed: "bg-blue-500/10 text-blue-600",
    resolved: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <Modal isOpen={isViewModalOpen} setIsOpen={onClose}>
      <Modal.Backdrop>
        <Modal.Content size="lg">
          <Modal.Header>
            <Modal.Title>Feedback Details</Modal.Title>
            <Modal.Close />
          </Modal.Header>
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "rounded px-2 py-1 text-[10px] font-bold uppercase",
                  statusConfig[selectedFeedback.status] || "bg-muted",
                )}
              >
                {selectedFeedback.status}
              </span>
              <span className="text-muted-foreground text-sm">
                {format(new Date(selectedFeedback.created_at), "PPP 'at' p")}
              </span>
            </div>

            <div className="bg-muted/50 flex items-center gap-4 rounded-lg p-4">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full font-bold">
                {selectedFeedback.user?.name?.[0].toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{selectedFeedback.user?.name}</span>
                <span className="text-muted-foreground text-xs">
                  {selectedFeedback.user?.email}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase">
                    Feature
                  </span>
                  <Badge className="bg-primary/10 text-primary border-none">
                    {selectedFeedback.feature?.name}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase">
                    Category
                  </span>
                  <span className="text-sm font-medium capitalize italic">
                    {selectedFeedback.category}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase">
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "size-3 rounded-full",
                        i < selectedFeedback.rating
                          ? "bg-amber-400"
                          : "bg-muted",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-bold">
                    {selectedFeedback.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground mb-1 block text-[10px] font-medium uppercase">
                  User Comment
                </span>
                <p className="bg-muted rounded p-4 text-sm italic">
                  "{selectedFeedback.comment}"
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-muted-foreground block text-[10px] font-medium uppercase">
                  Admin Response/Note
                </span>
                <FormControl
                  as="textarea"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add a note or response here..."
                  className="min-h-[100px] text-sm"
                />
              </div>
            </div>
          </div>
          <Modal.Footer className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600"
                onClick={() => handleUpdate("reviewed")}
                disabled={update_mutation.isPending}
              >
                Mark Reviewed
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-emerald-600"
                onClick={() => handleUpdate("resolved")}
                disabled={update_mutation.isPending}
              >
                Mark Resolved
              </Button>
            </div>
            <Button
              size="sm"
              onClick={() => handleUpdate()}
              disabled={update_mutation.isPending}
            >
              Save Note
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default FeatureFeedbackViewModal;
