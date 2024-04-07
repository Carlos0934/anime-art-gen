type QueuePayload<T> = {
  type: string;
  data: T;
};

export interface QueueService {
  push<T>(queue: string, data: QueuePayload<T>): Promise<void>;
}
