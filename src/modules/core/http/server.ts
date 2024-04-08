import { Hono } from "hono";

import { Exception, ExceptionType } from "../exception";
import { AppModule } from "../app-module";
import { eventBus } from "../eventBus";

export const createHonoApp = (modules?: (new () => AppModule)[]) => {
  const app = new Hono();

  app.get("/health", async (ctx) => {
    return ctx.json({ message: "OK" });
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
      console.error(error);
      return ctx.json(
        { message: error.message },
        {
          status: exceptionTypeToStatusCode[error.type] || 500,
        }
      );
    }

    if (error instanceof Response) {
      return ctx.json({ message: error.statusText }, { status: error.status });
    }

    return ctx.json({ message: "Internal server error" }, { status: 500 });
  });

  if (modules) {
    modules.forEach((module) => {
      const instance = new module();
      instance.register(app, eventBus);
    });
  }
  return app;
};
