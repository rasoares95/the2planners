import map from "../lib/oldids.mjs";

// Catch-all for addresses with no page: old WordPress links ending in the post ID
// (any slug, e.g. /some-old-title-13438 or /13438.html) go to the post's new page.
export default async (req) => {
  const url = new URL(req.url);
  const m = url.pathname.match(/(?:^\/|-)(\d{2,6})(?:\.html)?\/?$/);
  const to = m && map[m[1]];
  if (to) return new Response(null, { status: 301, headers: { Location: new URL(to, url.origin).href, "Cache-Control": "public, max-age=3600" } });
  let body = "Not found";
  try { const r = await fetch(new URL("/404.html", url.origin)); if (r.ok) body = await r.text(); } catch {}
  return new Response(body, { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
};
