import { createContext } from "@/core/context";
import { APIGatewayEvent } from "aws-lambda";

const ctx = createContext();

export const connectHandler = async (event: APIGatewayEvent) => {
  const { requestContext, body, queryStringParameters } = event;

  const userId = queryStringParameters?.userId;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }
  if (!requestContext.connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "connectionId is required",
      }),
    };
  }

  await ctx.usersConnectionsKvStore.set(userId, {
    userId,
    connectionId: requestContext.connectionId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Connected",
    }),
  };
};

export const disconnectHandler = async (event: APIGatewayEvent) => {
  const { requestContext } = event;

  if (!requestContext.connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "connectionId is required",
      }),
    };
  }

  await ctx.usersConnectionsKvStore.delete(requestContext.connectionId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Disconnected",
    }),
  };
};
