import { store, json, fail, postInfo, clean, allowed } from "../lib/feedback.mjs";

// POST /api/comment {post, name, text, website, t} -> saved as pending until approved
export default async (req, context) => {
  if (req.method !== "POST") return fail("Method not allowed", 405);
  let b;
  try { b = await req.json(); } catch { return fail("Bad request"); }
  if (!postInfo(b.post)) return fail("Unknown post", 404);
  if (b.website) return json({ ok: true, pending: true }); // honeypot: pretend it worked
  if (typeof b.t !== "number" || b.t < 3000) return fail("That was quick! Please try again in a few seconds.");
  const name = clean(b.name, 60);
  const text = clean(b.text, 2000);
  if (name.length < 1) return fail("Please add your name");
  if (text.length < 3) return fail("Please write a comment");
  if ((text.match(/https?:\/\//g) || []).length > 2) return fail("Please keep links to a minimum");
  if (!(await allowed(context, "comment", 6))) return fail("Too many comments, try again later", 429);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  await store().setJSON(`pending/${id}`, { id, post: b.post, name, text, date: new Date().toISOString() });
  return json({ ok: true, pending: true });
};
export const config = { path: "/api/comment" };
