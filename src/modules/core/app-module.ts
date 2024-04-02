import { Hono } from "hono";
import { Handler } from "./handler";
import { EventBus } from "./eventBus";

export abstract class AppModule {
  private router: Hono;
  private handlers: (new (...args: any[]) => Handler)[];
  private basePath: string;

  constructor({
    router,
    basePath,
    handlers,
  }: {
    router: Hono;
    basePath: string;
    handlers: (new (...args: any[]) => Handler)[];
  }) {
    this.router = router;
    this.handlers = handlers;
    this.basePath = basePath;
  }

  register(app: Hono, eventBus: EventBus) {
    app.route(this.basePath, this.router);
    this.handlers.forEach((handler) => {
      const instance = new handler();
      eventBus.registerHandler(instance.eventName, instance);
    });
  }
}
