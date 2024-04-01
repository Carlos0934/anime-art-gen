import { Hono } from "hono";
import authRouter from "./routes/auth";
import { RegisterAccountHandler } from "../../app/handlers/register-account";
import { eventBus } from "../utils/event-bus";
import { Exception, ExceptionType } from "../../domain/exceptions/exception";
import { LoginUserHandler } from "../../app/handlers/login-user";

export const createHonoApp = () => {
  const app = new Hono();

  const handlers = [RegisterAccountHandler, LoginUserHandler];
  handlers.forEach((handler) => {
    eventBus.registerHandler(handler.eventName, new handler());
  });

  app.get("/", async (ctx) => {
    return ctx.json({ message: "Hello, World!" });
  });

  app.onError((error, ctx) => {
    const exceptionTypeToStatusCode = {
      [ExceptionType.Conflict]: 409,
      [ExceptionType.Unauthorized]: 401,
      [ExceptionType.NotFound]: 404,
      [ExceptionType.BadArgument]: 400,
      [ExceptionType.Forbidden]: 403,
    };
    if (error instanceof Exception) {
      return ctx.json(
        { message: error.message },
        {
          status: exceptionTypeToStatusCode[error.type] || 500,
        }
      );
    }

    console.error(error);
    return ctx.json({ message: "Internal server error" }, 500);
  });

  app.route("/auth", authRouter);

  return app;
};
