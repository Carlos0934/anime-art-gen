import { handle } from "hono/aws-lambda";
import { createHonoApp } from "../http/server";

export const handler = handle(createHonoApp());
