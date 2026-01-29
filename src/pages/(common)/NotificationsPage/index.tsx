import NotificationsDataTableSection from "@/components/(common)/notifications-page/NotificationsDataTableSection";
import NotificationsFilterSection from "@/components/(common)/notifications-page/NotificationsFilterSection";
import NotificationViewModal from "@/components/modals/NotificationViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  setFilters,
  setIsViewModalOpen,
  setSelectedNotification,
} from "@/redux/slices/notifications-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteAllSelfNotificationRecipients,
  deleteNotificationRecipientBySelf,
  fetchNotificationRecipientsBySelf,
  readAllNotificationRecipientBySelf,
  updateNotificationRecipientBySelf,
} from "@/services/notification-recipient.service";
import type { TNotificationRecipient } from "@/types/notification-recipient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { filters } = useSelector(
    (state: RootState) => state.notificationsPage,
  );

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filter local states (initialized from Redux if needed)
  const [isRead, setIsRead] = useState<string>(
    filters.is_read === null ? "null" : String(filters.is_read),
  );
  const [type, setType] = useState<string>(filters.type || "null");

  const resetFilters = () => {
    setIsRead("null");
    setType("null");
    setPage(1);
    dispatch(setFilters({ is_read: null, type: null }));
  };

  // Sync with Redux
  useEffect(() => {
    const isReadValue = isRead === "null" ? null : isRead === "true";
    const typeValue = type === "null" ? null : type;
    dispatch(setFilters({ is_read: isReadValue, type: typeValue }));
    setPage(1);
  }, [isRead, type, dispatch]);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = { page, limit };
    if (filters.is_read !== null) params.is_read = filters.is_read;
    if (filters.type) params.type = filters.type;
    return params;
  }, [page, limit, filters]);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications-full", queryParams],
    queryFn: () => fetchNotificationRecipientsBySelf(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  const markAsRead_mutation = useMutation({
    mutationFn: (id: string) =>
      updateNotificationRecipientBySelf(id, { is_read: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-initial"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const delete_mutation = useMutation({
    mutationFn: (id: string) => deleteNotificationRecipientBySelf(id),
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-initial"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const markAllRead_mutation = useMutation({
    mutationFn: () => readAllNotificationRecipientBySelf(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-initial"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const clearAll_mutation = useMutation({
    mutationFn: () => deleteAllSelfNotificationRecipients(),
    onSuccess: () => {
      toast.success("All notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications-full"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-initial"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const onRead = (id: string) => markAsRead_mutation.mutate(id);

  const onDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Delete",
    });
    if (ok) delete_mutation.mutate(id);
  };

  const onMarkAllRead = async () => {
    const ok = await confirm({
      title: "Mark All Read",
      message: "Are you sure you want to mark all notifications as read?",
      confirmText: "Yes, Mark All",
    });
    if (ok) markAllRead_mutation.mutate();
  };

  const onClearAll = async () => {
    const ok = await confirm({
      title: "Clear All Notifications",
      message:
        "Are you sure you want to clear all notifications? This cannot be undone.",
      confirmText: "Yes, Clear All",
    });
    if (ok) clearAll_mutation.mutate();
  };

  const onView = (notification: TNotificationRecipient) => {
    dispatch(setSelectedNotification(notification));
    dispatch(setIsViewModalOpen(true));
    if (!notification.is_read) {
      onRead(notification._id);
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader name="Notifications" />
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            disabled={markAllRead_mutation.isPending}
            className="bg-primary/10 text-primary hover:bg-primary/20 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Mark All Read
          </button>
          <button
            onClick={onClearAll}
            disabled={clearAll_mutation.isPending}
            className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Clear All
          </button>
        </div>
      </div>
      <NotificationsFilterSection
        isRead={isRead}
        setIsRead={setIsRead}
        type={type}
        setType={setType}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content className="pt-6">
          <NotificationsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            onRead={onRead}
            onDelete={onDelete}
            onView={onView}
            state={{
              page,
              limit,
              total,
              setPage,
              setLimit,
            }}
          />
        </Card.Content>
      </Card>
      <NotificationViewModal />
    </main>
  );
};

export default NotificationsPage;
