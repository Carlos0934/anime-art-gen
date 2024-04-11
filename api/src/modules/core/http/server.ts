import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
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

    console.error(error);
    if (error instanceof Exception) {
      return ctx.json(
        { message: error.message },
        {
          status: exceptionTypeToStatusCode[error.type] || 500,
        }
      );
    }

    if (error instanceof HTTPException && error.res) {
      return error.res;
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
