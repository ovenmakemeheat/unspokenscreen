import { pgTable, bigint, smallint, text, timestamp, integer, real } from "drizzle-orm/pg-core";

export const surveyResponses = pgTable("survey_responses", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),

  // Metadata
  yearOfStudy: text("year_of_study"),
  department: text("department"),
  goal: text("goal"),

  // Section A: scale
  a1FamilyUnderstanding: smallint("a1_family_understanding"),
  a2GradeExpectation: smallint("a2_grade_expectation"),
  a3FearOfTruth: smallint("a3_fear_of_truth"),
  a4FuturePlanned: smallint("a4_future_planned"),
  a5MaintainGrades: smallint("a5_maintain_grades"),

  // Section B: scale
  b1SelfWorth: smallint("b1_self_worth"),
  b2StressImpact: smallint("b2_stress_impact"),
  b3LostIdentity: smallint("b3_lost_identity"),
  b4NotSafeSpace: smallint("b4_not_safe_space"),
  b5FailureFeeling: smallint("b5_failure_feeling"),

  // Section C: scale
  c1FamilyListens: smallint("c1_family_listens"),
  c3LieAboutGrades: smallint("c3_lie_about_grades"),
  c4KeepStressAlone: smallint("c4_keep_stress_alone"),
  c5Loneliness: smallint("c5_loneliness"),
  c6HardToTalk: smallint("c6_hard_to_talk"),
  c7LoveConditional: smallint("c7_love_conditional"),
  c8HomeSafe: smallint("c8_home_safe"),
  c9Dismissed: smallint("c9_dismissed"),
});

export const openAnswers = pgTable("open_answers", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  responseId: bigint("response_id", { mode: "number" })
    .notNull()
    .references(() => surveyResponses.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  answer: text("answer").notNull(),
});

export const choiceAnswers = pgTable("choice_answers", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  responseId: bigint("response_id", { mode: "number" })
    .notNull()
    .references(() => surveyResponses.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  choice: text("choice").notNull(),
});

export const wallNotes = pgTable("wall_notes", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  text: text("text").notNull(),
  tag: text("tag").notNull(),
  hearts: integer("hearts").notNull().default(0),
  color: text("color").notNull(),
  textColor: text("text_color").notNull().default("#1a1a1a"),
  floatClass: text("float_class").notNull(),
  width: integer("width").notNull(),
  posX: real("pos_x").notNull(),
  posY: real("pos_y").notNull(),
  rotation: real("rotation").notNull().default(0),
  delay: text("delay").notNull().default("0s"),
  avatarId: text("avatar_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wallReplies = pgTable("wall_replies", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  noteId: bigint("note_id", { mode: "number" })
    .notNull()
    .references(() => wallNotes.id, { onDelete: "cascade" }),
  fromName: text("from_name").notNull().default("ครอบครัว"),
  text: text("text").notNull(),
  avatarId: text("avatar_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
