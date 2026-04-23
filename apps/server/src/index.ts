import { env } from "@unspokenscreen/env/server";
import { Hono } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { surveyRouter } from "./routes/survey.js";
import { wallRouter } from "./routes/wall.js";

const app = new Hono();

const api = new OpenAPIHono();

api.use(logger());
api.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// ── Health ────────────────────────────────────────────────────
api.get("/", (c) => c.text("OK"));

// ── Survey routes ─────────────────────────────────────────────
api.route("/api/survey", surveyRouter);

// ── Wall routes ────────────────────────────────────────────────
api.route("/api/wall", wallRouter);

// ── OpenAPI spec ──────────────────────────────────────────────
api.doc("/api/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Unspoken Screen API",
    version: "1.0.0",
    description:
      "API for The Unspoken Screen — survey data from Thai engineering students about family expectations and mental health.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
});

// ── Swagger UI ────────────────────────────────────────────────
api.get("/docs", swaggerUI({ url: "/api/openapi.json" }));

app.route("/", api);

export default app;
