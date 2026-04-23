import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _env = (typeof process !== "undefined" ? process.env : {}) as Record<string, string | undefined>;

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    SUPABASE_URL: z.url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnv: {
    DATABASE_URL: _env["DATABASE_URL"],
    SUPABASE_URL: _env["SUPABASE_URL"],
    SUPABASE_ANON_KEY: _env["SUPABASE_ANON_KEY"],
    CORS_ORIGIN: _env["CORS_ORIGIN"],
    NODE_ENV: _env["NODE_ENV"],
  },
  emptyStringAsUndefined: true,
});
