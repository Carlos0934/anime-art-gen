import { Hono } from "hono";
import { Handler } from "./handler";
import { EventBus } from "./eventBus";

export abstract class AppModule {
  private routes: Hono;
  private handlers: (new (...args: any[]) => Handler)[];
  private basePath: string;

  constructor({
    routes,
    basePath,
    handlers,
  }: {
    routes: Hono;
    basePath: string;
    handlers: (new (...args: any[]) => Handler)[];
  }) {
    this.routes = routes;
    this.handlers = handlers;
    this.basePath = basePath;
  }

  register(app: Hono, eventBus: EventBus) {
    app.route(this.basePath, this.routes);
    this.handlers.forEach((handler) => eventBus.registerHandler(new handler()));
  }
}
