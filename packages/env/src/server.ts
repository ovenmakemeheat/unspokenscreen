import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    // SUPABASE_URL: z.url(),
    // SUPABASE_ANON_KEY: z.string().min(1),
    CORS_ORIGIN: z.string().min(1),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_SUPABASE_URL: z.url(),
    PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
