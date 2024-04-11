import { createContext } from "@/core/context";
import { APIGatewayEvent } from "aws-lambda";

const ctx = createContext();

const getUserIdFromHeaders = (headers: {
  [key: string]: string | undefined;
}) => {
  if (!headers.Authorization) {
    return null;
  }
  if (!headers.Authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = headers.Authorization.slice(7);

  return ctx.jwtService.verify<{ userId: string }>(token)?.userId;
};

export const connectHandler = async (event: APIGatewayEvent) => {
  const { requestContext, headers } = event;

  const userId = getUserIdFromHeaders(headers);

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
  const { requestContext, headers } = event;
  console.log("headers", headers);
  if (!requestContext.connectionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "connectionId is required",
      }),
    };
  }

  const userId = getUserIdFromHeaders(headers);

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "userId is required",
      }),
    };
  }

  await ctx.usersConnectionsKvStore.delete(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Disconnected",
    }),
  };
};
