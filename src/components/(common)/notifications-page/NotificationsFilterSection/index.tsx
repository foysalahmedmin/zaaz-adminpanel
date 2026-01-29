import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormControl } from "@/components/ui/FormControl";
import { FilterX } from "lucide-react";
import React from "react";

interface NotificationsFilterSectionProps {
  isRead: string;
  setIsRead: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  onReset: () => void;
}

const NotificationsFilterSection: React.FC<NotificationsFilterSectionProps> = ({
  isRead,
  setIsRead,
  type,
  setType,
  onReset,
}) => {
  return (
    <Card className="p-4">
      <Card.Content>
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-[200px] flex-1 space-y-1">
            <FormControl.Label className="uppercase">
              Read Status
            </FormControl.Label>
            <FormControl
              as="select"
              value={isRead}
              onChange={(e) => setIsRead(e.target.value)}
              className="h-9"
            >
              <option value="null">All Status</option>
              <option value="true">Read</option>
              <option value="false">Unread</option>
            </FormControl>
          </div>

          <div className="min-w-[200px] flex-1 space-y-1">
            <FormControl.Label className="uppercase">
              Notification Type
            </FormControl.Label>
            <FormControl
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9"
            >
              <option value="null">All Types</option>
              <option value="request">Request</option>
              <option value="approval">Approval</option>
            </FormControl>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex h-9 items-center gap-2"
            >
              <FilterX className="size-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default NotificationsFilterSection;
