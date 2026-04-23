import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { db, wallNotes, wallReplies } from "@unspokenscreen/db";
import { desc, eq, sql } from "drizzle-orm";

const router = new OpenAPIHono();

// ── Shared schemas ─────────────────────────────────────────────
const ReplySchema = z.object({
  id: z.number(),
  from: z.string(),
  text: z.string(),
  avatarId: z.string().nullable(),
});

const NoteSchema = z.object({
  id: z.number(),
  text: z.string(),
  tag: z.string(),
  hearts: z.number(),
  color: z.string(),
  textColor: z.string(),
  floatClass: z.string(),
  width: z.number(),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  delay: z.string(),
  avatarId: z.string().nullable(),
  replies: z.array(ReplySchema),
}).openapi("WallNote");

const CreateNoteSchema = z.object({
  text: z.string().min(1).max(300),
  tag: z.string().min(1),
  color: z.string(),
  textColor: z.string(),
  floatClass: z.string(),
  width: z.number().int(),
  x: z.number(),
  y: z.number(),
  rotation: z.number(),
  delay: z.string(),
  avatarId: z.string().nullable().optional(),
}).openapi("CreateNote");

const CreateReplySchema = z.object({
  text: z.string().min(1).max(300),
  from: z.string().default("ครอบครัว"),
  avatarId: z.string().nullable().optional(),
}).openapi("CreateReply");

// ── GET /api/wall/notes ────────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/notes",
    tags: ["Wall"],
    summary: "List all wall notes with replies",
    responses: {
      200: {
        description: "Notes",
        content: { "application/json": { schema: z.array(NoteSchema) } },
      },
    },
  }),
  async (c) => {
    const notes = await db
      .select()
      .from(wallNotes)
      .orderBy(desc(wallNotes.createdAt));

    const replies = await db.select().from(wallReplies);

    const replyMap = new Map<number, typeof replies>();
    for (const r of replies) {
      const arr = replyMap.get(r.noteId) ?? [];
      arr.push(r);
      replyMap.set(r.noteId, arr);
    }

    const result = notes.map((n) => ({
      id: n.id,
      text: n.text,
      tag: n.tag,
      hearts: n.hearts,
      color: n.color,
      textColor: n.textColor,
      floatClass: n.floatClass,
      width: n.width,
      x: n.posX,
      y: n.posY,
      rotation: n.rotation,
      delay: n.delay,
      avatarId: n.avatarId,
      replies: (replyMap.get(n.id) ?? []).map((r) => ({
        id: r.id,
        from: r.fromName,
        text: r.text,
        avatarId: r.avatarId,
      })),
    }));

    return c.json(result);
  }
);

// ── POST /api/wall/notes ───────────────────────────────────────
router.openapi(
  createRoute({
    method: "post",
    path: "/notes",
    tags: ["Wall"],
    summary: "Create a new wall note",
    request: { body: { content: { "application/json": { schema: CreateNoteSchema } } } },
    responses: {
      201: {
        description: "Created note",
        content: { "application/json": { schema: NoteSchema } },
      },
    },
  }),
  async (c) => {
    const body = c.req.valid("json");
    const rows = await db
      .insert(wallNotes)
      .values({
        text: body.text,
        tag: body.tag,
        color: body.color,
        textColor: body.textColor,
        floatClass: body.floatClass,
        width: body.width,
        posX: body.x,
        posY: body.y,
        rotation: body.rotation,
        delay: body.delay,
        avatarId: body.avatarId ?? null,
      })
      .returning();

    const note = rows[0]!;
    return c.json(
      {
        id: note.id,
        text: note.text,
        tag: note.tag,
        hearts: note.hearts,
        color: note.color,
        textColor: note.textColor,
        floatClass: note.floatClass,
        width: note.width,
        x: note.posX,
        y: note.posY,
        rotation: note.rotation,
        delay: note.delay,
        avatarId: note.avatarId,
        replies: [],
      },
      201
    );
  }
);

// ── POST /api/wall/notes/:id/heart ─────────────────────────────
router.openapi(
  createRoute({
    method: "post",
    path: "/notes/{id}/heart",
    tags: ["Wall"],
    summary: "Increment hearts on a note",
    request: { params: z.object({ id: z.coerce.number().int() }) },
    responses: {
      200: {
        description: "Updated hearts count",
        content: { "application/json": { schema: z.object({ hearts: z.number() }) } },
      },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const [updated] = await db
      .update(wallNotes)
      .set({ hearts: sql`${wallNotes.hearts} + 1` })
      .where(eq(wallNotes.id, id))
      .returning({ hearts: wallNotes.hearts });

    if (!updated) return c.json({ error: "Not found" }, 404);
    return c.json({ hearts: updated.hearts });
  }
);

// ── POST /api/wall/notes/:id/replies ───────────────────────────
router.openapi(
  createRoute({
    method: "post",
    path: "/notes/{id}/replies",
    tags: ["Wall"],
    summary: "Add a family reply to a note",
    request: {
      params: z.object({ id: z.coerce.number().int() }),
      body: { content: { "application/json": { schema: CreateReplySchema } } },
    },
    responses: {
      201: {
        description: "Created reply",
        content: { "application/json": { schema: ReplySchema } },
      },
      404: { description: "Note not found" },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");

    const note = await db
      .select({ id: wallNotes.id })
      .from(wallNotes)
      .where(eq(wallNotes.id, id))
      .limit(1);

    if (!note.length) return c.json({ error: "Note not found" }, 404);

    const replyRows = await db
      .insert(wallReplies)
      .values({
        noteId: id,
        fromName: body.from,
        text: body.text,
        avatarId: body.avatarId ?? null,
      })
      .returning();

    const reply = replyRows[0]!;
    return c.json(
      { id: reply.id, from: reply.fromName, text: reply.text, avatarId: reply.avatarId },
      201
    );
  }
);

export { router as wallRouter };
