import type { AdapterHandlers, ContentItem, Conversion } from "@/lib/growth-hub-adapter";
import { all } from "@/lib/db/client";

/**
 * Growth Hub site adapter handlers (contract v1, docs in the growth-hub repo,
 * docs/ADAPTER.md). Read-only: the pages are code, so drafts, publishing,
 * noindex and redirects are not implemented (the adapter answers 501).
 *
 * Conversions carry ids and timestamps only: no names, emails or team names
 * leave the site.
 */

const SITE = "https://slackactivity.com";

/** The app's own sitemap is the page inventory (it is generated at build time). */
async function sitemapPages(): Promise<ContentItem[]> {
  const port = process.env.PORT || "3000";
  const res = await fetch(`http://127.0.0.1:${port}/sitemap.xml`, {
    signal: AbortSignal.timeout(8_000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();

  const items: ContentItem[] = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = /<loc>([^<]+)<\/loc>/.exec(m[1])?.[1]?.trim();
    if (!loc) continue;
    const path = new URL(loc).pathname.replace(/\/+$/, "") || "/";
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(m[1])?.[1]?.trim();
    const slug = path.split("/").filter(Boolean).pop() ?? "home";
    const section = path.split("/").filter(Boolean)[0] ?? "";
    items.push({
      id: path,
      url: `${SITE}${path === "/" ? "/" : path}`,
      type: section === "guides" && path !== "/guides" ? "article" : "page",
      title: slug === "home" ? "Slackactivity" : slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
      cluster: section || undefined,
      status: "published",
      updatedAt: lastmod ? new Date(lastmod).toISOString() : undefined,
    });
  }
  return items;
}

async function conversionsSince(since: string): Promise<Conversion[]> {
  const rows = await all<{ id: string; type: string; at: string }>(
    `select 'signup:' || id as id, 'signup' as type, created_at as at
       from users where created_at >= ?
     union all
     select 'workspace:' || id, 'workspace_connected', created_at
       from workspace where created_at >= ?
     order by at, id`,
    [since, since]
  );
  return rows.map((r) => ({ id: r.id, type: r.type, at: new Date(r.at).toISOString() }));
}

export const hubHandlers: AdapterHandlers = {
  listContent: () => sitemapPages(),
  getContent: async (id) => (await sitemapPages()).find((p) => p.id === id) ?? null,
  conversions: ({ since }) => conversionsSince(since),
  health: async () => ({ site: "slackactivity.com", conversions: ["signup", "workspace_connected"] }),
};
