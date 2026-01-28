import type { TNotification } from "./notification";
import type { TResponse } from "./response.type";

export type TNotificationAction = {
  title: string;
  type: string;
  url: string;
};

export type TNotificationMetadata = {
  url?: string;
  image?: string;
  source?: string;
  reference?: string;
  actions: TNotificationAction[];
};

export type TNotificationRecipient = {
  _id: string;
  notification: TNotification;
  metadata?: TNotificationMetadata;
  is_read: boolean;
  read_at?: Date | null;
  created_at: string;
};

export type TNotificationRecipientResponse = TResponse<TNotificationRecipient>;
export type TNotificationRecipientsResponse = TResponse<
  TNotificationRecipient[]
>;
export type TNotificationRecipientReadAllResponse = TResponse<{
  count: number;
}>;
