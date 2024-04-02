import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "./schema";

const url = process.env.DATABASE_URL!;
const authToken = process.env.DATABASE_AUTH_TOKEN!;

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

export default db;
