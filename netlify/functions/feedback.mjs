import { store, json, fail, postInfo, summary } from "../lib/feedback.mjs";

// GET /api/feedback?post=recipes/classic-tiramisu&voter=abc  -> rating summary + approved comments
export default async (req) => {
  if (req.method !== "GET") return fail("Method not allowed", 405);
  const url = new URL(req.url);
  const post = url.searchParams.get("post");
  const info = postInfo(post);
  if (!info) return fail("Unknown post", 404);
  const s = store();
  const [ratings, comments] = await Promise.all([
    info.rate ? s.get(`ratings/${post}`, { type: "json" }) : null,
    s.get(`comments/${post}`, { type: "json" }),
  ]);
  const voter = url.searchParams.get("voter");
  return json({
    post,
    rating: info.rate ? { ...summary(ratings), mine: (ratings && voter && ratings[voter]) || 0 } : null,
    comments: (comments || []).map(({ id, name, text, date }) => ({ id, name, text, date })),
  });
};
export const config = { path: "/api/feedback" };
