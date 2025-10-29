import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://slackactivity.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1 },
    { path: "/how-it-works", priority: 0.9 },
    { path: "/pricing", priority: 0.9 },
    { path: "/solutions", priority: 0.8 },
    { path: "/guides", priority: 0.8 },
    { path: "/use-cases", priority: 0.8 },
    { path: "/contact", priority: 0.7 },
    { path: "/privacy-policy", priority: 0.5 },
    { path: "/terms", priority: 0.5 },
    { path: "/solutions/slack-auto-away-prevention", priority: 0.9 },
    { path: "/solutions/slack-status-automation", priority: 0.9 },
    { path: "/guides/how-to-stay-online-on-slack", priority: 0.9 },
    { path: "/use-cases/remote-workers", priority: 0.8 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }));

  return routes;
}
