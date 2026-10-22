import { getStore } from "@netlify/blobs";
import POSTS from "./posts.mjs";

export const store = () => getStore({ name: "feedback", consistency: "strong" });
export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
export const fail = (msg, status = 400) => json({ error: msg }, status);

// post keys are the page paths without slashes, e.g. "recipes/classic-tiramisu"
export function postInfo(post) {
  return typeof post === "string" && Object.prototype.hasOwnProperty.call(POSTS, post) ? POSTS[post] : null;
}
export const clean = (s, max) => String(s ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);

async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 12).map(x => x.toString(16).padStart(2, "0")).join("");
}
// simple per-visitor rate limit: max `limit` actions of `kind` per hour
export async function allowed(context, kind, limit) {
  const ip = (context && context.ip) || "unknown";
  const key = `rl/${kind}/${await sha(ip + "|the2planners")}`;
  const s = store();
  const now = Date.now();
  const list = ((await s.get(key, { type: "json" })) || []).filter(t => now - t < 3600e3);
  if (list.length >= limit) return false;
  list.push(now);
  await s.setJSON(key, list);
  return true;
}
export function summary(ratings) {
  const v = Object.values(ratings || {});
  const count = v.length;
  const avg = count ? Math.round((v.reduce((a, b) => a + b, 0) / count) * 10) / 10 : 0;
  return { avg, count };
}
export function isAdmin(req) {
  const key = (globalThis.Netlify && Netlify.env.get("ADMIN_KEY")) || process.env.ADMIN_KEY;
  if (!key) return "unset";
  const got = req.headers.get("x-admin-key") || "";
  if (got.length !== key.length) return false;
  let diff = 0;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}
