import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { db, wallNotes, wallReplies, wallUsers } from "@unspokenscreen/db";
import { desc, eq, sql } from "drizzle-orm";

const router = new OpenAPIHono();

// ── Helper: resolve user from token header ─────────────────────
async function resolveUser(token: string | undefined) {
  if (!token) return null;
  const rows = await db
    .select()
    .from(wallUsers)
    .where(eq(wallUsers.token, token))
    .limit(1);
  return rows[0] ?? null;
}

// ── POST /api/wall/session ─────────────────────────────────────
router.openapi(
  createRoute({
    method: "post",
    path: "/session",
    tags: ["Wall"],
    summary: "Create a new anonymous session",
    responses: {
      201: { description: "Session token created" },
    },
  }),
  async (c) => {
    const rows = await db.insert(wallUsers).values({}).returning();
    const user = rows[0]!;
    return c.json({ token: user.token, userId: user.id }, 201);
  },
);

// ── GET /api/wall/notes ────────────────────────────────────────
router.openapi(
  createRoute({
    method: "get",
    path: "/notes",
    tags: ["Wall"],
    summary: "Get all wall notes with replies",
    responses: {
      200: { description: "List of notes" },
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
      imageData: n.imageData,
      userId: n.userId,
      replies: (replyMap.get(n.id) ?? []).map((r) => ({
        id: r.id,
        from: r.fromName,
        text: r.text,
        avatarId: r.avatarId,
      })),
    }));

    return c.json(result);
  },
);

// ── POST /api/wall/notes ───────────────────────────────────────
const CreateNoteSchema = z.object({
  text: z.string().max(300).default(""),
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
  imageData: z.string().nullable().optional(),
});

router.openapi(
  createRoute({
    method: "post",
    path: "/notes",
    tags: ["Wall"],
    summary: "Create a new wall note",
    request: {
      body: {
        content: { "application/json": { schema: CreateNoteSchema } },
        required: true,
      },
    },
    responses: {
      201: { description: "Note created" },
      401: { description: "Invalid or missing session token" },
    },
  }),
  async (c) => {
    const token = c.req.header("x-user-token");
    const user = await resolveUser(token);
    if (!user) return c.json({ error: "Invalid or missing session token" }, 401);

    const body = CreateNoteSchema.parse(await c.req.json());

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
        imageData: body.imageData ?? null,
        userId: user.id,
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
        imageData: note.imageData,
        userId: note.userId,
        replies: [],
      },
      201,
    );
  },
);

// ── PUT /api/wall/notes/:id ────────────────────────────────────
const UpdateNoteSchema = z.object({
  text: z.string().min(1).max(300).optional(),
  tag: z.string().min(1).optional(),
  color: z.string().optional(),
  x: z.number().optional(),
  y: z.number().optional(),
});

router.openapi(
  createRoute({
    method: "put",
    path: "/notes/{id}",
    tags: ["Wall"],
    summary: "Update a wall note",
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { "application/json": { schema: UpdateNoteSchema } },
        required: true,
      },
    },
    responses: {
      200: { description: "Note updated" },
      400: { description: "Invalid id" },
      401: { description: "Invalid or missing session token" },
      403: { description: "Forbidden" },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id)) return c.json({ error: "Invalid id" }, 400);

    const token = c.req.header("x-user-token");
    const user = await resolveUser(token);
    if (!user) return c.json({ error: "Invalid or missing session token" }, 401);

    const existing = await db
      .select()
      .from(wallNotes)
      .where(eq(wallNotes.id, id))
      .limit(1);

    if (!existing.length) return c.json({ error: "Not found" }, 404);
    if (existing[0]!.userId !== user.id) return c.json({ error: "Forbidden" }, 403);

    const body = UpdateNoteSchema.parse(await c.req.json());

    const updates: Partial<typeof wallNotes.$inferInsert> = {};
    if (body.text !== undefined) updates.text = body.text;
    if (body.tag !== undefined) updates.tag = body.tag;
    if (body.color !== undefined) updates.color = body.color;
    if (body.x !== undefined) updates.posX = body.x;
    if (body.y !== undefined) updates.posY = body.y;

    const [updated] = await db
      .update(wallNotes)
      .set(updates)
      .where(eq(wallNotes.id, id))
      .returning();

    return c.json({
      id: updated!.id,
      text: updated!.text,
      tag: updated!.tag,
      color: updated!.color,
      x: updated!.posX,
      y: updated!.posY,
      userId: updated!.userId,
    });
  },
);

// ── DELETE /api/wall/notes/:id ─────────────────────────────────
router.openapi(
  createRoute({
    method: "delete",
    path: "/notes/{id}",
    tags: ["Wall"],
    summary: "Delete a wall note",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: { description: "Note deleted" },
      400: { description: "Invalid id" },
      401: { description: "Invalid or missing session token" },
      403: { description: "Forbidden" },
      404: { description: "Not found" },
    },
  }),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id)) return c.json({ error: "Invalid id" }, 400);

    const token = c.req.header("x-user-token");
    const user = await resolveUser(token);
    if (!user) return c.json({ error: "Invalid or missing session token" }, 401);

    const existing = await db
      .select({ userId: wallNotes.userId })
      .from(wallNotes)
      .where(eq(wallNotes.id, id))
      .limit(1);

    if (!existing.length) return c.json({ error: "Not found" }, 404);
    if (existing[0]!.userId !== user.id) return c.json({ error: "Forbidden" }, 403);

    await db.delete(wallNotes).where(eq(wallNotes.id, id));
    return c.json({ deleted: true });
  },
);

// ── POST /api/wall/notes/:id/heart ─────────────────────────────
router.openapi(
  createRoute({
    method: "post",
    path: "/notes/{id}/heart",
    tags: ["Wall"],
    summary: "Heart a wall note",
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: { description: "Updated heart count" },
      400: { description: "Invalid id" },
      404: { description: "Note not found" },
    },
  }),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id)) return c.json({ error: "Invalid id" }, 400);

    const [updated] = await db
      .update(wallNotes)
      .set({ hearts: sql`${wallNotes.hearts} + 1` })
      .where(eq(wallNotes.id, id))
      .returning({ hearts: wallNotes.hearts });

    if (!updated) return c.json({ error: "Not found" }, 404);
    return c.json({ hearts: updated.hearts });
  },
);

// ── POST /api/wall/notes/:id/replies ───────────────────────────
const CreateReplySchema = z.object({
  text: z.string().min(1).max(300),
  from: z.string().default("ครอบครัว"),
  avatarId: z.string().nullable().optional(),
});

router.openapi(
  createRoute({
    method: "post",
    path: "/notes/{id}/replies",
    tags: ["Wall"],
    summary: "Reply to a wall note",
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { "application/json": { schema: CreateReplySchema } },
        required: true,
      },
    },
    responses: {
      201: { description: "Reply created" },
      400: { description: "Invalid id" },
      404: { description: "Note not found" },
    },
  }),
  async (c) => {
    const id = Number(c.req.param("id"));
    if (!Number.isInteger(id)) return c.json({ error: "Invalid id" }, 400);

    const body = CreateReplySchema.parse(await c.req.json());

    const exists = await db
      .select({ id: wallNotes.id })
      .from(wallNotes)
      .where(eq(wallNotes.id, id))
      .limit(1);

    if (!exists.length) return c.json({ error: "Note not found" }, 404);

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
      {
        id: reply.id,
        from: reply.fromName,
        text: reply.text,
        avatarId: reply.avatarId,
      },
      201,
    );
  },
);

export { router as wallRouter };
