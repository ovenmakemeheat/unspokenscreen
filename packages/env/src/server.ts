import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    SUPABASE_URL: z.url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    CORS_ORIGIN: z.url(),
  },
  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: {
    DATABASE_URL: Bun.env.DATABASE_URL,
    SUPABASE_URL: Bun.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: Bun.env.SUPABASE_ANON_KEY,
    CORS_ORIGIN: Bun.env.CORS_ORIGIN,
    NODE_ENV: Bun.env.NODE_ENV,
  },
  emptyStringAsUndefined: true,
});
