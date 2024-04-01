import { Context } from "./context";

export abstract class Handler<T extends Event, R = void> {
  abstract handle(event: T, ctx: Context): Promise<R>;
}

export abstract class Event {
  abstract readonly name: string;
}
