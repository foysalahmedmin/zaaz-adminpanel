import { Drawer } from "@/components/ui/Drawer";
import useNotification from "@/hooks/states/useNotification";
import useSetting from "@/hooks/states/useSetting";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, MoveLeft, MoveRight } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";

const Notification: React.FC = () => {
  const { setting } = useSetting();
  const { unread, notifications } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-full items-center">
      <button onClick={() => setIsOpen(true)} className="relative pr-1">
        <BellIcon className="size-6 cursor-pointer" />
        {unread > 0 && (
          <span className="bg-accent text-accent-foreground absolute -top-1 right-0 inline-flex h-4 min-w-4 transform items-center justify-center rounded-full text-[10px] font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} asPortal side="right">
        <Drawer.Backdrop />
        <Drawer.Content
          className="flex h-screen w-80 max-w-[90vw] flex-col"
          side={setting.direction == "rtl" ? "left" : "right"}
        >
          <Drawer.Header className="h-16 border-b">
            <Drawer.Title className="uppercase">Notifications</Drawer.Title>
            <Drawer.Close className="size-8 rounded-full" />
          </Drawer.Header>

          <Drawer.Body className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.slice(0, 10).map((item) => {
                  const timeAgo = formatDistanceToNow(
                    new Date(item.created_at),
                    {
                      addSuffix: true,
                    },
                  );

                  return (
                    <div
                      key={item._id}
                      className={cn(
                        "rounded-lg border p-3 transition-all duration-200",
                        item.is_read
                          ? "bg-card border-border opacity-70"
                          : "border-primary/30 bg-primary/5",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 overflow-hidden">
                          <p
                            className={cn(
                              "truncate text-sm font-semibold",
                              item.is_read
                                ? "text-muted-foreground"
                                : "text-foreground",
                            )}
                          >
                            {item.notification?.title}
                          </p>
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-normal">
                            {item.notification?.message}
                          </p>
                        </div>

                        {!item.is_read && (
                          <span className="bg-primary mt-1.5 h-2 w-2 flex-shrink-0 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"></span>
                        )}
                      </div>

                      <div className="text-muted-foreground mt-2 flex items-center justify-between text-[10px]">
                        <span>{item.notification?.type}</span>
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-muted-foreground flex h-40 flex-col items-center justify-center space-y-2 text-center text-sm">
                  <BellIcon className="size-10 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </Drawer.Body>
          <Drawer.Footer className="flex h-16 items-center justify-center border-t px-4">
            <Link
              to={"/notifications"}
              onClick={() => setIsOpen(false)}
              className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
            >
              View All Notifications{" "}
              {setting.direction === "ltr" ? (
                <MoveRight strokeWidth={1.5} className="size-4" />
              ) : (
                <MoveLeft strokeWidth={1.5} className="size-4" />
              )}
            </Link>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  );
};

export default Notification;
