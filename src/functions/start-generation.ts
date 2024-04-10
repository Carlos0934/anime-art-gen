import { createContext } from "@/core/context";
import { EventBus } from "@/core/eventBus";
import { SNSMessage, SQSEvent } from "aws-lambda";
import { StartRequestGenerationEvent } from "modules/generation/events";
import { StartGenerationRequestHandler } from "modules/generation/handlers/start-generation";
import { RequestGenerationSchema } from "modules/generation/schemas";

const handler = new StartGenerationRequestHandler();
const ctx = createContext();

exports.handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const { body } = record;

    const { Message } = JSON.parse(body) as SNSMessage;

    const payload = JSON.parse(Message);
    const userId = payload.userId;
    const result = await RequestGenerationSchema.safeParseAsync(payload.params);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const event = new StartRequestGenerationEvent({
      userId,
      params: result.data,
    });

    await handler.handle(event, ctx);
  }
};
