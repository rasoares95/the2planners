import map from "../lib/oldids.mjs";
import scheduled from "../lib/scheduled.mjs";
import sitemap from "../lib/sitemap.mjs";

// Catch-all for addresses with no static file:
// - /sitemap.xml, listing only pages whose date has come
// - scheduled posts, shown from their date (Lisbon time), "not found" before
// - old WordPress links ending in the post ID (/some-old-title-13438, /13438.html) -> the post's new page
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon" }).format(new Date());
const html = (body, status) => new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" } });

export default async (req) => {
  const url = new URL(req.url);
  const now = today();

  if (url.pathname === "/sitemap.xml") {
    const rows = sitemap.filter(([, , from]) => !from || from <= now)
      .map(([p, lm]) => `  <url><loc>https://the2planners.com${p}</loc><lastmod>${lm}</lastmod></url>`).join("\n");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`,
      { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
  }

  let path = url.pathname.replace(/index\.html$/, "");
  if (!path.endsWith("/") && !path.includes(".")) path += "/";
  const s = scheduled[path];
  if (s && s.date <= now) {
    if (!url.pathname.endsWith("/")) return new Response(null, { status: 301, headers: { Location: new URL(path, url.origin).href } });
    return html(s.html, 200);
  }

  const m = !s && url.pathname.match(/(?:^\/|-)(\d{2,6})(?:\.html)?\/?$/);
  const to = m && map[m[1]];
  if (to) return new Response(null, { status: 301, headers: { Location: new URL(to, url.origin).href, "Cache-Control": "public, max-age=3600" } });

  let body = "Not found";
  try { const r = await fetch(new URL("/404.html", url.origin)); if (r.ok) body = await r.text(); } catch {}
  return html(body, 404);
};
