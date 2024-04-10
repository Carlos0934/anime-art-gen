import { Event } from "@/core/handler";
import { SNS } from "@aws-sdk/client-sns";

import { GenerationEvents } from "modules/generation/events";
import { PubNotificationService } from "./interface";

export class SNSPubNotificationService implements PubNotificationService {
  private readonly sns: SNS;
  private readonly topicMap: Record<string, string> = {
    [GenerationEvents.ImageGenerationFail]:
      process.env.IMAGE_GENERATION_ERROR_TOPIC!,
    [GenerationEvents.ImageGenerationStart]:
      process.env.IMAGE_GENERATION_START_TOPIC!,
    [GenerationEvents.ImageGenerationComplete]:
      process.env.IMAGE_GENERATION_SUCCESS_TOPIC!,
  };
  constructor() {
    this.sns = new SNS();
  }

  async publish({ name, ...data }: Event): Promise<void> {
    const topic = this.topicMap[name];
    if (!topic) {
      throw new Error(`No topic found for event ${name}`);
    }

    await this.sns.publish({
      TopicArn: topic,
      Message: JSON.stringify(data),
    });
  }
}
