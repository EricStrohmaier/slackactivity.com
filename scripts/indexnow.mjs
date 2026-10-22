/**
 * Submit every URL in the live sitemap to IndexNow (Bing, Yandex, Seznam, …).
 *
 *   node scripts/indexnow.mjs            # submit all sitemap URLs
 *   node scripts/indexnow.mjs --dry-run  # just list what would be sent
 *
 * IndexNow takes URL lists, not sitemaps, so we read /sitemap.xml (following
 * sitemap indexes) and post its <loc>s. The key must be served at
 * https://<host>/<key>.txt (see /public).
 */
const HOST = "slackactivity.com";
const KEY = "fd6c2e79140a47d596dfdc413369c70a";
const dryRun = process.argv.includes("--dry-run");

async function collectUrls(sitemapUrl) {
  const xml = await (await fetch(sitemapUrl)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (!xml.includes("<sitemapindex")) return locs;
  return (await Promise.all(locs.map(collectUrls))).flat();
}

const urlList = [...new Set(await collectUrls(`https://${HOST}/sitemap.xml`))].filter(
  (url) => new URL(url).host === HOST
);

if (!urlList.length) {
  console.error("No URLs found in sitemap.");
  process.exit(1);
}
if (dryRun) {
  console.log(urlList.join("\n"));
  console.log(`\n${urlList.length} URLs (dry run, nothing sent).`);
}

// IndexNow accepts up to 10,000 URLs per request.
for (let i = 0; !dryRun && i < urlList.length; i += 10000) {
  const batch = urlList.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: batch,
    }),
  });
  console.log(`${res.status} ${res.statusText} — ${batch.length} URLs submitted`);
  const body = await res.text();
  if (body) console.log(body);
  if (!res.ok) process.exit(1);
}
