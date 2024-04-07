import { QueueService } from "./interface";
import { SQS, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSQueueService implements QueueService {
  private readonly sqs: SQS;

  constructor() {
    this.sqs = new SQS({
      apiVersion: "2012-11-05",
      region: process.env.AWS_REGION,
    });
  }

  async push<T>(queue: string, data: T): Promise<void> {
    const params = new SendMessageCommand({
      MessageBody: JSON.stringify(data),
      QueueUrl: queue,
    });

    await this.sqs.send(params);
  }
}
