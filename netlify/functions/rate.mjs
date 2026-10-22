import { store, json, fail, postInfo, summary, allowed } from "../lib/feedback.mjs";

// POST /api/rate {post, stars, voter} -> one rating per visitor per recipe (re-rating replaces it)
export default async (req, context) => {
  if (req.method !== "POST") return fail("Method not allowed", 405);
  let b;
  try { b = await req.json(); } catch { return fail("Bad request"); }
  const info = postInfo(b.post);
  if (!info || !info.rate) return fail("Ratings are only available on recipes", 404);
  const stars = Number(b.stars);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return fail("Pick between 1 and 5 stars");
  if (typeof b.voter !== "string" || !/^[a-z0-9]{12,64}$/.test(b.voter)) return fail("Bad request");
  if (!(await allowed(context, "rate", 40))) return fail("Too many ratings, try again later", 429);
  const s = store();
  const key = `ratings/${b.post}`;
  const ratings = (await s.get(key, { type: "json" })) || {};
  ratings[b.voter] = stars;
  await s.setJSON(key, ratings);
  return json({ ok: true, rating: { ...summary(ratings), mine: stars } });
};
export const config = { path: "/api/rate" };
