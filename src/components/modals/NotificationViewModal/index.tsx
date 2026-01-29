import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { setIsViewModalOpen } from "@/redux/slices/notifications-page-slice";
import type { RootState } from "@/redux/store";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const NotificationViewModal = () => {
  const dispatch = useDispatch();
  const { selectedNotification, isViewModalOpen } = useSelector(
    (state: RootState) => state.notificationsPage,
  );

  if (!selectedNotification) return null;

  const onClose = () => dispatch(setIsViewModalOpen(false));

  return (
    <Modal isOpen={isViewModalOpen} setIsOpen={onClose}>
      <Modal.Backdrop>
        <Modal.Content size="lg">
          <Modal.Header>
            <Modal.Title>Notification Details</Modal.Title>
          </Modal.Header>
          <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
              <Badge
                className={cn(
                  selectedNotification.is_read
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-amber-500/10 text-amber-600",
                )}
              >
                {selectedNotification.is_read ? "Read" : "Unread"}
              </Badge>
              <span className="text-muted-foreground text-sm">
                {format(
                  new Date(selectedNotification.created_at),
                  "PPP 'at' p",
                )}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold">
                {selectedNotification.notification?.title}
              </h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {selectedNotification.notification?.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-[10px] font-medium uppercase">
                  Type
                </span>
                <span className="capitalize">
                  {selectedNotification.notification?.type}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] font-medium uppercase">
                  Priority
                </span>
                <span className="capitalize">
                  {selectedNotification.notification?.priority || "Normal"}
                </span>
              </div>
            </div>

            {selectedNotification.notification?.url && (
              <div className="pt-4">
                <Link
                  to={selectedNotification.notification.url}
                  onClick={onClose}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  View Related Content →
                </Link>
              </div>
            )}
          </div>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default NotificationViewModal;
