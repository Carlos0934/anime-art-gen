import { createContext } from "@/core/context";
import type { APIGatewayEvent } from "aws-lambda";

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
    connectionId: requestContext.connectionId,
  });

  await ctx.connectionsUsersKvStore.set(requestContext.connectionId, {
    userId,
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

  const connection = await ctx.connectionsUsersKvStore.get(
    requestContext.connectionId
  );

  if (!connection) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Connection not found",
      }),
    };
  }

  await ctx.usersConnectionsKvStore.delete(connection.userId);

  await ctx.connectionsUsersKvStore.delete(requestContext.connectionId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Disconnected",
    }),
  };
};
