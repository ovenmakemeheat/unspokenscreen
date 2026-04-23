import { env } from "@unspokenscreen/env/server";
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { handle } from "hono/vercel";
import { surveyRouter } from "./routes/survey.js";

export const config = { runtime: "edge" };

const app = new OpenAPIHono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

// ── Health ────────────────────────────────────────────────────
app.get("/", (c) => c.text("OK"));

// ── Survey routes ─────────────────────────────────────────────
app.route("/api/survey", surveyRouter);

// ── OpenAPI spec ──────────────────────────────────────────────
app.doc("/api/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Unspoken Screen API",
    version: "1.0.0",
    description: "API for The Unspoken Screen — survey data from Thai engineering students about family expectations and mental health.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local dev" }],
});

// ── Swagger UI ────────────────────────────────────────────────
app.get("/docs", swaggerUI({ url: "/api/openapi.json" }));

export default handle(app);
