import { Hono } from "hono";

import { Exception, ExceptionType } from "../exception";
import { AppModule } from "../app-module";
import { eventBus } from "../eventBus";

export const createHonoApp = (modules?: (new () => AppModule)[]) => {
  const app = new Hono();

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

  if (modules) {
    modules.forEach((module) => {
      const instance = new module();
      instance.register(app, eventBus);
    });
  }
  return app;
};
