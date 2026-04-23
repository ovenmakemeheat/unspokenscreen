import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@unspokenscreen/env/server";

import * as schema from "./schema";

export function createDb() {
  const client = postgres(env.DATABASE_URL, { ssl: "prefer", prepare: false });
  return drizzle({ client, schema });
}

export const db = createDb();

export * from "./schema";
