import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slackactivity.com";

export const dynamic = "force-static";
export const runtime = "nodejs";

export default function sitemap(): MetadataRoute.Sitemap {
  type RouteDef = { path: string; priority: number; lastModified?: Date };
  const appDir = path.resolve(process.cwd(), "app");
  const staticRoutes: RouteDef[] = [
    { path: "/", priority: 1 },
    { path: "/how-it-works", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/solutions", priority: 0.8 },
    { path: "/guides", priority: 0.8 },
    { path: "/use-cases", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy-policy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
  ];

  const staticSet = new Set(staticRoutes.map((r) => r.path));

  const findSectionPages = (section: string): { path: string; mtime: Date }[] => {
    const sectionDir = path.join(appDir, section);
    const out: { path: string; mtime: Date }[] = [];
    if (!fs.existsSync(sectionDir)) return out;

    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && entry.name === "page.tsx") {
          const dirOfPage = path.dirname(full);
          const relative = dirOfPage.replace(appDir, "").replace(/\\/g, "/");
          const withoutTrailing = relative.replace(/\/$/, "");
          const segments = withoutTrailing.split("/").filter(Boolean);
          const cleanedSegments = segments.filter((s) => !(s.startsWith("(") && s.endsWith(")")));
          if (cleanedSegments.some((s) => s.includes("[") || s.includes("]"))) {
            continue;
          }
          const normalized = cleanedSegments.length ? `/${cleanedSegments.join("/")}` : "/";
          const stat = fs.statSync(full);
          out.push({ path: normalized, mtime: stat.mtime });
        }
      }
    };

    walk(sectionDir);
    return out;
  };

  const sections: { name: string; defaultPriority: number }[] = [
    { name: "solutions", defaultPriority: 0.8 },
    { name: "guides", defaultPriority: 0.8 },
    { name: "use-cases", defaultPriority: 0.8 },
  ];

  const dynamicRoutes: RouteDef[] = [];
  for (const { name, defaultPriority } of sections) {
    for (const { path: p, mtime } of findSectionPages(name)) {
      if (!staticSet.has(p)) {
        dynamicRoutes.push({ path: p, priority: defaultPriority, lastModified: mtime });
      }
    }
  }

  const all: RouteDef[] = [...staticRoutes, ...dynamicRoutes];

  return all.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));
}
