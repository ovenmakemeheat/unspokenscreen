import { OpenAPIHono } from "@hono/zod-openapi";
import { db, wallNotes, wallReplies } from "@unspokenscreen/db";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

const router = new OpenAPIHono();

// ── GET /api/wall/notes ────────────────────────────────────────
router.get("/notes", async (c) => {
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
});

// ── POST /api/wall/notes ───────────────────────────────────────
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
});

router.post("/notes", async (c) => {
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
    201,
  );
});

// ── POST /api/wall/notes/:id/heart ─────────────────────────────
router.post("/notes/:id/heart", async (c) => {
  const id = Number(c.req.param("id"));
  if (!Number.isInteger(id)) return c.json({ error: "Invalid id" }, 400);

  const [updated] = await db
    .update(wallNotes)
    .set({ hearts: sql`${wallNotes.hearts} + 1` })
    .where(eq(wallNotes.id, id))
    .returning({ hearts: wallNotes.hearts });

  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json({ hearts: updated.hearts });
});

// ── POST /api/wall/notes/:id/replies ───────────────────────────
const CreateReplySchema = z.object({
  text: z.string().min(1).max(300),
  from: z.string().default("ครอบครัว"),
  avatarId: z.string().nullable().optional(),
});

router.post("/notes/:id/replies", async (c) => {
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
});

export { router as wallRouter };
