import { createContext } from "../../app/context";
import { Event, Handler } from "../../domain/handler";

export class EventBus {
  private static instance: EventBus;
  private handlers: Record<string, Handler<Event, unknown>> = {};

  private constructor() {}

  static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  registerHandler(name: string, handler: Handler<Event, unknown>) {
    this.handlers[name] = handler;
  }

  getHandler(name: string) {
    return this.handlers[name];
  }

  async publish(event: Event) {
    const handler = this.handlers[event.name];
    if (!handler) {
      throw new Error(`Handler not found for event ${event.name}`);
    }
    const context = createContext();
    return handler.handle(event, context);
  }
}

export const eventBus = EventBus.getInstance();
