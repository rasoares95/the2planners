import { store, json, fail, postInfo, isAdmin } from "../lib/feedback.mjs";

// GET  /api/admin            -> pending comments + published comments
// POST /api/admin {action, id, post} with action approve | reject | delete
export default async (req) => {
  const ok = isAdmin(req);
  if (ok === "unset") return fail("The admin password has not been set up in Netlify yet", 503);
  if (!ok) return fail("Wrong password", 401);
  const s = store();
  if (req.method === "GET") {
    const pend = await s.list({ prefix: "pending/" });
    const pending = (await Promise.all(pend.blobs.map(b => s.get(b.key, { type: "json" })))).filter(Boolean)
      .sort((a, b) => a.date.localeCompare(b.date));
    const pub = await s.list({ prefix: "comments/" });
    const published = [];
    for (const b of pub.blobs) {
      const post = b.key.slice("comments/".length);
      for (const c of (await s.get(b.key, { type: "json" })) || []) published.push({ ...c, post });
    }
    published.sort((a, b) => b.date.localeCompare(a.date));
    return json({ pending, published: published.slice(0, 200) });
  }
  if (req.method !== "POST") return fail("Method not allowed", 405);
  let b;
  try { b = await req.json(); } catch { return fail("Bad request"); }
  if (typeof b.id !== "string" || !/^[a-z0-9]{6,32}$/.test(b.id)) return fail("Bad request");
  if (b.action === "approve" || b.action === "reject") {
    const c = await s.get(`pending/${b.id}`, { type: "json" });
    if (!c) return fail("Comment not found", 404);
    if (b.action === "approve" && postInfo(c.post)) {
      const key = `comments/${c.post}`;
      const list = (await s.get(key, { type: "json" })) || [];
      list.push({ id: c.id, name: c.name, text: c.text, date: c.date });
      list.sort((x, y) => x.date.localeCompare(y.date));
      await s.setJSON(key, list);
    }
    await s.delete(`pending/${b.id}`);
    return json({ ok: true });
  }
  if (b.action === "delete") {
    if (!postInfo(b.post)) return fail("Unknown post", 404);
    const key = `comments/${b.post}`;
    const list = ((await s.get(key, { type: "json" })) || []).filter(c => c.id !== b.id);
    await s.setJSON(key, list);
    return json({ ok: true });
  }
  return fail("Unknown action");
};
export const config = { path: "/api/admin" };
