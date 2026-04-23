import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  getSummary,
  getAllScaleQuestions,
  getScaleQuestion,
  getAllOpenQuestions,
  getOpenQuestion,
  getAllChoiceQuestions,
} from "../data/survey.js";

const router = new OpenAPIHono();

// ── GET /api/survey/summary ───────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/summary",
    tags: ["Survey"],
    summary: "Get survey summary",
    responses: {
      200: { description: "Survey summary data" },
    },
  }),
  (c) => c.json(getSummary()),
);

// ── GET /api/survey/scale ─────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/scale",
    tags: ["Survey"],
    summary: "Get all scale questions",
    responses: {
      200: { description: "List of scale questions" },
    },
  }),
  (c) => c.json(getAllScaleQuestions()),
);

// ── GET /api/survey/open ──────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/open",
    tags: ["Survey"],
    summary: "Get all open questions",
    responses: {
      200: { description: "List of open questions" },
    },
  }),
  (c) => c.json(getAllOpenQuestions()),
);

// ── GET /api/survey/choices ───────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/choices",
    tags: ["Survey"],
    summary: "Get all choice questions",
    responses: {
      200: { description: "List of choice questions" },
    },
  }),
  (c) => c.json(getAllChoiceQuestions()),
);

// ── GET /api/survey/scale/:id
router.openapi(
  createRoute({
    method: "get",
    path: "/scale/{id}",
    tags: ["Survey"],
    summary: "Get a scale question by ID",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: { description: "Scale question data" },
      404: { description: "Question not found" },
    },
  }),
  (c) => {
    const id = c.req.param("id");
    const data = getScaleQuestion(id);
    if (!data) return c.json({ error: "Question not found" }, 404);
    return c.json(data);
  },
);

// ── GET /api/survey/open/:id
router.openapi(
  createRoute({
    method: "get",
    path: "/open/{id}",
    tags: ["Survey"],
    summary: "Get an open question by ID",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: { description: "Open question data" },
      404: { description: "Question not found" },
    },
  }),
  (c) => {
    const id = c.req.param("id");
    const data = getOpenQuestion(id);
    if (!data) return c.json({ error: "Question not found" }, 404);
    return c.json(data);
  },
);

export { router as surveyRouter };
