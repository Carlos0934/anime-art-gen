import { Event } from "@/core/handler";

export interface PubNotificationService {
  publish(event: Event): Promise<void>;
}
