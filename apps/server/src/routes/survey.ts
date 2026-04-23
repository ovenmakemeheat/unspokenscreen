import { OpenAPIHono } from "@hono/zod-openapi";
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
router.get("/summary", (c) => c.json(getSummary()));

// ── GET /api/survey/scale ─────────────────────────────────────
router.get("/scale", (c) => c.json(getAllScaleQuestions()));

// ── GET /api/survey/open ──────────────────────────────────────
router.get("/open", (c) => c.json(getAllOpenQuestions()));

// ── GET /api/survey/choices ───────────────────────────────────
router.get("/choices", (c) => c.json(getAllChoiceQuestions()));

// ── GET /api/survey/scale/:id
router.get("/scale/:id", (c) => {
  const id = c.req.param("id");
  const data = getScaleQuestion(id);
  if (!data) return c.json({ error: "Question not found" }, 404);
  return c.json(data);
});

// ── GET /api/survey/open/:id
router.get("/open/:id", (c) => {
  const id = c.req.param("id");
  const data = getOpenQuestion(id);
  if (!data) return c.json({ error: "Question not found" }, 404);
  return c.json(data);
});

export { router as surveyRouter };
