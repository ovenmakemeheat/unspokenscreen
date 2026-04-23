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

// ── Shared schemas ────────────────────────────────────────────
const ScaleQuestionSchema = z.object({
  id: z.string(),
  questionTh: z.string(),
  type: z.literal("scale"),
  average: z.number(),
  count: z.number(),
  distribution: z.record(z.string(), z.number()),
}).openapi("ScaleQuestion");

const OpenQuestionSchema = z.object({
  id: z.string(),
  questionTh: z.string(),
  type: z.literal("open"),
  count: z.number(),
  answers: z.array(z.string()),
  wordcloudImageUrl: z.string().nullable().openapi({
    description: "Placeholder — null until a word cloud image is generated and uploaded.",
    example: null,
  }),
}).openapi("OpenQuestion");

const SummarySchema = z.object({
  totalResponses: z.number(),
  yearBreakdown: z.record(z.string(), z.number()),
  departmentBreakdown: z.record(z.string(), z.number()),
  goalBreakdown: z.record(z.string(), z.number()),
  keyStats: z.object({
    avgFamilyUnderstanding: z.number(),
    avgGradeExpectation: z.number(),
    avgFearOfTruth: z.number(),
    avgSelfWorthImpact: z.number(),
    avgStressImpact: z.number(),
    avgLostIdentity: z.number(),
    avgNotSafeSpace: z.number(),
    avgFamilyListens: z.number(),
    avgLoneliness: z.number(),
    avgConditionalLove: z.number(),
  }),
}).openapi("SurveySummary");

// ── GET /api/survey/summary ───────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/summary",
    tags: ["Survey"],
    summary: "Survey summary statistics",
    description: "Total responses, demographic breakdown, and key averaged scores from the Google Form.",
    responses: {
      200: { description: "Summary", content: { "application/json": { schema: SummarySchema } } },
    },
  }),
  (c) => c.json(getSummary())
);

// ── GET /api/survey/scale ─────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/scale",
    tags: ["Survey"],
    summary: "All scale questions (1–5) with distributions",
    responses: {
      200: { description: "Scale questions", content: { "application/json": { schema: z.array(ScaleQuestionSchema) } } },
    },
  }),
  (c) => c.json(getAllScaleQuestions())
);

// ── GET /api/survey/open ──────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/open",
    tags: ["Survey"],
    summary: "All open-text questions with raw answers",
    description: "Raw Thai-language answers per open-text question. `wordcloudImageUrl` is null until images are uploaded.",
    responses: {
      200: { description: "Open questions", content: { "application/json": { schema: z.array(OpenQuestionSchema) } } },
    },
  }),
  (c) => c.json(getAllOpenQuestions())
);

// ── GET /api/survey/choices ───────────────────────────────────
const ChoiceQuestionSchema = z.object({
  id: z.string(),
  questionTh: z.string(),
  type: z.literal("category"),
  total: z.number(),
  choices: z.array(z.object({ label: z.string(), count: z.number() })),
}).openapi("ChoiceQuestion");

router.openapi(
  createRoute({
    method: "get",
    path: "/choices",
    tags: ["Survey"],
    summary: "Plottable multi-choice questions with frequency counts",
    responses: {
      200: { description: "Choice questions", content: { "application/json": { schema: z.array(ChoiceQuestionSchema) } } },
    },
  }),
  (c) => c.json(getAllChoiceQuestions())
);

// ── GET /api/survey/scale/:id  (plain route — 404 needs no type gymnastics)
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
