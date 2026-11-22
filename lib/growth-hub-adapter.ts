/**
 * Growth Hub site adapter v1.2.0 (contract v1). Single-file build.
 *
 * DO NOT EDIT. Vendored from growth-hub (packages/adapter). To update, copy the
 * new dist/growth-hub-adapter.ts over this file. Docs: packages/adapter/README.md
 * and docs/ADAPTER.md in the growth-hub repo.
 *
 * Zero dependencies (node:crypto + Web Request/Response). Use with the Node.js
 * runtime: export const runtime = "nodejs".
 */
/* eslint-disable */

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

// ---------------------------------------------------------------- contract.ts

/**
 * Growth Hub site adapter, contract v1.
 *
 * The types every site and the hub agree on, plus small dependency-free runtime
 * validators (no zod: this file is vendored into site repos as-is). Validators
 * return { ok, value } or { ok: false, issues } with human-readable issues that
 * name the field, so a broken integration says exactly what is wrong.
 *
 * Versioning: additive changes (new optional fields, new endpoints) stay v1.
 * Removing or retyping a field, or changing auth, is v2 (see docs/ADAPTER.md).
 */

export const CONTRACT_VERSION = 1;
export const ADAPTER_PACKAGE_VERSION = "1.2.0";

export const CONTENT_TYPES = ["article", "checklist", "page", "product", "other"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = ["published", "draft"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** One entry of the site's inventory. `id` is the site's own stable id (row id, slug, file path). */
export interface ContentItem {
  id: string;
  /** Absolute public URL (https://example.com/blog/foo). For drafts: where it will live. */
  url: string;
  type: ContentType;
  title: string;
  cluster?: string;
  status: ContentStatus;
  /** ISO 8601. */
  publishedAt?: string;
  /** ISO 8601. */
  updatedAt?: string;
  /** Anything else worth knowing (keywords, author, word count). Small, JSON only. */
  meta?: Record<string, unknown>;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ImageRef {
  url: string;
  alt: string;
  /** Free text, e.g. "Photo by Jane Doe on Unsplash". */
  credit?: string;
  width?: number;
  height?: number;
}

export interface SourceRef {
  url: string;
  title: string;
}

/** A full item, used as a style reference and as the base of a refresh. */
export interface ContentDetail extends ContentItem {
  /** Meta / SERP description. */
  description?: string;
  /** The <title> when it differs from the H1 title. */
  metaTitle?: string;
  /** Body as markdown when the site stores markdown/MDX. At least one of markdown/html. */
  markdown?: string;
  /** Body as HTML when the site stores HTML or renders from a CMS. */
  html?: string;
  faq?: FaqItem[];
  images?: ImageRef[];
}

/**
 * A draft the hub asks the site to store. Never visible on the site until
 * POST /publish/:id with an approval id.
 *
 * New item (no targetId): type, slug, title, body are required.
 * Refresh (targetId = an existing ContentItem.id): every field is optional and
 * an omitted field means "keep the current value". The site must store the
 * refresh beside the live version, never over it, until publish.
 */
export interface DraftInput {
  targetId?: string;
  type?: ContentType;
  /** kebab-case, a-z 0-9 and hyphens, no slashes. */
  slug?: string;
  /** The H1. */
  title?: string;
  /** The <title> / SERP title, when different from the H1. */
  metaTitle?: string;
  description?: string;
  /** Markdown. Body only: no H1, no blocks the template renders itself. */
  body?: string;
  cluster?: string;
  faq?: FaqItem[];
  heroImage?: ImageRef;
  sources?: SourceRef[];
  /** Opaque to the site: target keyword, hub action id, etc. Store it if you can. */
  meta?: Record<string, unknown>;
}

export interface DraftResult {
  /** The draft's id on the site. Pass it to /publish/:id. */
  id: string;
  /** A URL a reviewer can open to see the draft rendered (admin preview, PR, preview deploy). */
  previewUrl?: string;
  action: "created" | "updated";
}

export interface PublishInput {
  /** The hub's approval id (the approved action). Sent only after a human approved. */
  approvalId: string;
  /** Who approved, for the site's audit log. */
  approvedBy?: string;
  /** ISO 8601. */
  approvedAt?: string;
}

export interface PublishResult {
  id: string;
  /** Final public URL. */
  url: string;
  published: true;
}

/** Approved, reversible search visibility changes. No content is deleted. */
export interface NoindexInput extends PublishInput { noindex: boolean }
export interface RedirectInput extends PublishInput { to: string }
export interface NoindexResult { id: string; url: string; noindex: boolean }
export interface RedirectResult { id: string; url: string; to: string; status: 301 }

/** Exact URL identity for inventory checks. Fragments are not separate pages. */
export function contentUrlKey(value: string): string {
  const url = new URL(value);
  if (!isHttpUrl(value) || url.username || url.password) throw new Error("Expected a public http(s) URL.");
  url.hash = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

/** A goal event the site knows best: a checkout, a booked call, a signup. */
export interface Conversion {
  /** Unique per event, so the hub can dedupe on re-sync. */
  id: string;
  /** e.g. checkout_completed, booked_call, signup, lead. */
  type: string;
  /** ISO 8601. */
  at: string;
  /** Landing or conversion path, e.g. /ratgeber/foo. */
  path?: string;
  value?: number;
  currency?: string;
  meta?: Record<string, unknown>;
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ListContentParams {
  type?: ContentType;
  cursor?: string;
  /** 1..500, default 100. */
  limit: number;
}

export interface ConversionsParams {
  /** ISO 8601, inclusive. */
  since: string;
  cursor?: string;
  /** 1..1000, default 500. */
  limit: number;
}

export interface HealthResult {
  ok: true;
  contract: number;
  /** Which endpoints this site implements: listContent, getContent, upsertDraft, publish, conversions. */
  capabilities: string[];
  [extra: string]: unknown;
}

/* --------------------------------------------------------------- validators */

export type Parsed<T> = { ok: true; value: T } | { ok: false; issues: string[] };

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIMITS = {
  title: 300,
  slug: 200,
  description: 1000,
  body: 500_000,
  faqItems: 50,
  sources: 50,
  id: 500,
} as const;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isHttpUrl(v: string): boolean {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function isIsoDate(v: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v));
}

/** Small field reader that records issues instead of throwing. */
class Reader {
  issues: string[] = [];
  constructor(private o: Record<string, unknown>, private at: string) {}

  str(key: string, opts: { required?: boolean; max?: number; url?: boolean; date?: boolean; pattern?: RegExp } = {}): string | undefined {
    const v = this.o[key];
    const name = `${this.at}${key}`;
    if (v === undefined || v === null || v === "") {
      if (opts.required) this.issues.push(`${name} is required`);
      return undefined;
    }
    if (typeof v !== "string") {
      this.issues.push(`${name} must be a string`);
      return undefined;
    }
    if (opts.max && v.length > opts.max) this.issues.push(`${name} is ${v.length} chars (max ${opts.max})`);
    if (opts.url && !isHttpUrl(v)) this.issues.push(`${name} must be an absolute http(s) URL`);
    if (opts.date && !isIsoDate(v)) this.issues.push(`${name} must be an ISO 8601 date`);
    if (opts.pattern && !opts.pattern.test(v)) this.issues.push(`${name} has an invalid format`);
    return v;
  }

  oneOf<T extends string>(key: string, values: readonly T[], required = false): T | undefined {
    const v = this.o[key];
    if (v === undefined || v === null) {
      if (required) this.issues.push(`${this.at}${key} is required`);
      return undefined;
    }
    if (typeof v !== "string" || !(values as readonly string[]).includes(v)) {
      this.issues.push(`${this.at}${key} must be one of ${values.join(", ")}`);
      return undefined;
    }
    return v as T;
  }

  num(key: string): number | undefined {
    const v = this.o[key];
    if (v === undefined || v === null) return undefined;
    if (typeof v !== "number" || !Number.isFinite(v)) {
      this.issues.push(`${this.at}${key} must be a finite number`);
      return undefined;
    }
    return v;
  }

  record(key: string): Record<string, unknown> | undefined {
    const v = this.o[key];
    if (v === undefined || v === null) return undefined;
    if (!isObj(v)) {
      this.issues.push(`${this.at}${key} must be an object`);
      return undefined;
    }
    return v;
  }

  list<T>(key: string, max: number, item: (v: unknown, at: string, issues: string[]) => T | undefined): T[] | undefined {
    const v = this.o[key];
    if (v === undefined || v === null) return undefined;
    if (!Array.isArray(v)) {
      this.issues.push(`${this.at}${key} must be an array`);
      return undefined;
    }
    if (v.length > max) this.issues.push(`${this.at}${key} has ${v.length} entries (max ${max})`);
    const out: T[] = [];
    v.slice(0, max).forEach((x, i) => {
      const r = item(x, `${this.at}${key}[${i}].`, this.issues);
      if (r !== undefined) out.push(r);
    });
    return out;
  }
}

/** Drops undefined keys so payloads stay minimal and round-trip cleanly. */
function compact<T extends object>(o: T): T {
  const r = o as Record<string, unknown>;
  for (const k of Object.keys(r)) if (r[k] === undefined) delete r[k];
  return o;
}

function faqItem(v: unknown, at: string, issues: string[]): FaqItem | undefined {
  if (!isObj(v)) {
    issues.push(`${at.slice(0, -1)} must be an object {q, a}`);
    return undefined;
  }
  const r = new Reader(v, at);
  const q = r.str("q", { required: true, max: 500 });
  const a = r.str("a", { required: true, max: 5000 });
  issues.push(...r.issues);
  return q && a ? { q, a } : undefined;
}

function imageRef(v: unknown, at: string, issues: string[]): ImageRef | undefined {
  if (!isObj(v)) {
    issues.push(`${at.slice(0, -1)} must be an object {url, alt}`);
    return undefined;
  }
  const r = new Reader(v, at);
  const url = r.str("url", { required: true, url: true });
  const alt = r.str("alt", { max: 500 }) ?? "";
  const out = compact<ImageRef>({ url: url ?? "", alt, credit: r.str("credit", { max: 300 }), width: r.num("width"), height: r.num("height") });
  issues.push(...r.issues);
  return url ? out : undefined;
}

function sourceRef(v: unknown, at: string, issues: string[]): SourceRef | undefined {
  if (!isObj(v)) {
    issues.push(`${at.slice(0, -1)} must be an object {url, title}`);
    return undefined;
  }
  const r = new Reader(v, at);
  const url = r.str("url", { required: true, url: true });
  const title = r.str("title", { max: 500 }) ?? "";
  issues.push(...r.issues);
  return url ? { url, title } : undefined;
}

function readItem(r: Reader): ContentItem {
  return compact<ContentItem>({
    id: r.str("id", { required: true, max: LIMITS.id }) ?? "",
    url: r.str("url", { required: true, url: true }) ?? "",
    type: r.oneOf("type", CONTENT_TYPES, true) ?? "other",
    title: r.str("title", { required: true, max: LIMITS.title }) ?? "",
    cluster: r.str("cluster", { max: 200 }),
    status: r.oneOf("status", CONTENT_STATUSES, true) ?? "published",
    publishedAt: r.str("publishedAt", { date: true }),
    updatedAt: r.str("updatedAt", { date: true }),
    meta: r.record("meta"),
  });
}

export function parseContentItem(v: unknown, at = ""): Parsed<ContentItem> {
  if (!isObj(v)) return { ok: false, issues: [`${at || "item"} must be an object`] };
  const r = new Reader(v, at);
  const value = readItem(r);
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

export function parseContentDetail(v: unknown): Parsed<ContentDetail> {
  if (!isObj(v)) return { ok: false, issues: ["item must be an object"] };
  const r = new Reader(v, "");
  const base = readItem(r);
  const value = compact<ContentDetail>({
    ...base,
    description: r.str("description", { max: LIMITS.description }),
    metaTitle: r.str("metaTitle", { max: LIMITS.title }),
    markdown: r.str("markdown", { max: LIMITS.body }),
    html: r.str("html", { max: LIMITS.body * 2 }),
    faq: r.list("faq", LIMITS.faqItems, faqItem),
    images: r.list("images", 100, imageRef),
  });
  if (value.markdown === undefined && value.html === undefined) r.issues.push("one of markdown or html is required");
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

export function parseDraftInput(v: unknown): Parsed<DraftInput> {
  if (!isObj(v)) return { ok: false, issues: ["body must be a JSON object"] };
  const r = new Reader(v, "");
  const targetId = r.str("targetId", { max: LIMITS.id });
  const isNew = targetId === undefined;
  const value = compact<DraftInput>({
    targetId,
    type: r.oneOf("type", CONTENT_TYPES, isNew),
    slug: r.str("slug", { required: isNew, max: LIMITS.slug, pattern: SLUG_RE }),
    title: r.str("title", { required: isNew, max: LIMITS.title }),
    metaTitle: r.str("metaTitle", { max: LIMITS.title }),
    description: r.str("description", { max: LIMITS.description }),
    body: r.str("body", { required: isNew, max: LIMITS.body }),
    cluster: r.str("cluster", { max: 200 }),
    faq: r.list("faq", LIMITS.faqItems, faqItem),
    heroImage: v.heroImage === undefined || v.heroImage === null ? undefined : imageRef(v.heroImage, "heroImage.", r.issues),
    sources: r.list("sources", LIMITS.sources, sourceRef),
    meta: r.record("meta"),
  });
  if (!isNew && Object.keys(value).length === 1) r.issues.push("a refresh must change at least one field");
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

export function parseDraftResult(v: unknown): Parsed<DraftResult> {
  if (!isObj(v)) return { ok: false, issues: ["draft result must be an object"] };
  const r = new Reader(v, "");
  const value = compact<DraftResult>({
    id: r.str("id", { required: true, max: LIMITS.id }) ?? "",
    previewUrl: r.str("previewUrl", { url: true }),
    action: r.oneOf("action", ["created", "updated"] as const, true) ?? "created",
  });
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

export function parsePublishInput(v: unknown): Parsed<PublishInput> {
  if (!isObj(v)) return { ok: false, issues: ["body must be a JSON object with approvalId"] };
  const r = new Reader(v, "");
  const value = compact<PublishInput>({
    approvalId: r.str("approvalId", { required: true, max: 200 }) ?? "",
    approvedBy: r.str("approvedBy", { max: 200 }),
    approvedAt: r.str("approvedAt", { date: true }),
  });
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

export function parsePublishResult(v: unknown): Parsed<PublishResult> {
  if (!isObj(v)) return { ok: false, issues: ["publish result must be an object"] };
  const r = new Reader(v, "");
  const id = r.str("id", { required: true, max: LIMITS.id }) ?? "";
  const url = r.str("url", { required: true, url: true }) ?? "";
  if (v.published !== true) r.issues.push("published must be true");
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value: { id, url, published: true } };
}

export function parseConversion(v: unknown, at = ""): Parsed<Conversion> {
  if (!isObj(v)) return { ok: false, issues: [`${at || "conversion"} must be an object`] };
  const r = new Reader(v, at);
  const value = compact<Conversion>({
    id: r.str("id", { required: true, max: LIMITS.id }) ?? "",
    type: r.str("type", { required: true, max: 100 }) ?? "",
    at: r.str("at", { required: true, date: true }) ?? "",
    path: r.str("path", { max: 2000 }),
    value: r.num("value"),
    currency: r.str("currency", { max: 10 }),
    meta: r.record("meta"),
  });
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value };
}

/** Validates every element of a list; issues are prefixed with the index. */
export function parseList<T>(v: unknown, parse: (x: unknown, at: string) => Parsed<T>): Parsed<T[]> {
  if (!Array.isArray(v)) return { ok: false, issues: ["items must be an array"] };
  const out: T[] = [];
  const issues: string[] = [];
  v.forEach((x, i) => {
    const p = parse(x, `items[${i}].`);
    if (p.ok) out.push(p.value);
    else issues.push(...p.issues);
  });
  return issues.length ? { ok: false, issues } : { ok: true, value: out };
}

export function parseNoindexInput(v: unknown): Parsed<NoindexInput> {
  const approval = parsePublishInput(v);
  if (!approval.ok) return approval;
  if (!isObj(v) || typeof v.noindex !== "boolean") return { ok: false, issues: ["noindex must be a boolean"] };
  return { ok: true, value: { ...approval.value, noindex: v.noindex } };
}

export function parseRedirectInput(v: unknown): Parsed<RedirectInput> {
  const approval = parsePublishInput(v);
  if (!approval.ok) return approval;
  if (!isObj(v) || typeof v.to !== "string") return { ok: false, issues: ["to must be an absolute http(s) URL"] };
  try { contentUrlKey(v.to); } catch { return { ok: false, issues: ["to must be an absolute http(s) URL without credentials"] }; }
  return { ok: true, value: { ...approval.value, to: v.to } };
}

export function parseNoindexResult(v: unknown): Parsed<NoindexResult> {
  if (!isObj(v)) return { ok: false, issues: ["noindex result must be an object"] };
  const r = new Reader(v, "");
  const id = r.str("id", { required: true, max: LIMITS.id }) ?? "";
  const url = r.str("url", { required: true, url: true }) ?? "";
  if (typeof v.noindex !== "boolean") r.issues.push("noindex must be a boolean");
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value: { id, url, noindex: v.noindex as boolean } };
}

export function parseRedirectResult(v: unknown): Parsed<RedirectResult> {
  if (!isObj(v)) return { ok: false, issues: ["redirect result must be an object"] };
  const r = new Reader(v, "");
  const id = r.str("id", { required: true, max: LIMITS.id }) ?? "";
  const url = r.str("url", { required: true, url: true }) ?? "";
  const to = r.str("to", { required: true, url: true }) ?? "";
  if (v.status !== 301) r.issues.push("status must be 301");
  return r.issues.length ? { ok: false, issues: r.issues } : { ok: true, value: { id, url, to, status: 301 } };
}

// ---------------------------------------------------------------- auth.ts

/**
 * Request signing, contract v1. Both sides hold one shared secret per site.
 *
 *   canonical = timestamp + "\n" + METHOD + "\n" + path + "\n" + query + "\n" + body
 *   signature = hex(HMAC-SHA256(secret, canonical))
 *
 *   Authorization:   HMAC-SHA256 <signature>
 *   x-hub-timestamp: <unix ms>
 *   x-hub-contract:  1
 *
 * - path:  the route relative to the adapter's mount point, as sent on the wire
 *          (percent-encoded), e.g. "/content/abc" or "/publish/abc". The mount
 *          point (/api/hub) is not signed, so a site can move it freely.
 * - query: the query parameters sorted by key then value, each part encoded with
 *          encodeURIComponent, joined with "&". No leading "?". "" when none.
 *          Sorting makes the signature survive proxies that reorder params.
 * - body:  the raw request body as sent, byte for byte. "" for GET. Verify
 *          BEFORE JSON.parse: re-serializing changes the bytes.
 *
 * The timestamp is inside the signed string, so it cannot be swapped. Requests
 * more than 5 minutes from the server's clock are rejected (replay window).
 * Every write in the contract is idempotent (drafts upsert, publish is a no-op
 * when already live), so a replay inside the window changes nothing.
 *
 * Same idea as kinderversicherer's /api/content-inbox (HMAC-SHA256 over
 * `${ts}.${canonical}`), extended to bind the method and path so a signed GET
 * cannot be replayed against another route.
 */

export const AUTH_SCHEME = "HMAC-SHA256";
export const TIMESTAMP_HEADER = "x-hub-timestamp";
export const CONTRACT_HEADER = "x-hub-contract";
export const MAX_SKEW_MS = 5 * 60 * 1000;
/** Secrets shorter than this are treated as unset (fail closed). Use `openssl rand -hex 32`. */
export const MIN_SECRET_LENGTH = 32;

export type QueryInput = URLSearchParams | Record<string, string | number | boolean | null | undefined>;

/** Sorted, encoded query string without "?". Undefined/null/"" values are dropped. */
export function canonicalQuery(q: QueryInput | undefined): string {
  if (!q) return "";
  const pairs: [string, string][] = [];
  if (q instanceof URLSearchParams) {
    q.forEach((v, k) => pairs.push([k, v]));
  } else {
    for (const [k, v] of Object.entries(q)) if (v !== undefined && v !== null && v !== "") pairs.push([k, String(v)]);
  }
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
  return pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

export interface SignParts {
  timestamp: string;
  method: string;
  /** Adapter-relative route path, e.g. "/content/abc". */
  path: string;
  /** Output of canonicalQuery. */
  query: string;
  body: string;
}

export function canonicalString(p: SignParts): string {
  return [p.timestamp, p.method.toUpperCase(), p.path, p.query, p.body].join("\n");
}

export function computeSignature(secret: string, p: SignParts): string {
  return createHmac("sha256", secret).update(canonicalString(p), "utf8").digest("hex");
}

/** Headers for an outgoing request (hub side). */
export function signRequest(
  secret: string,
  req: { method: string; path: string; query?: QueryInput; body?: string; now?: number },
): Record<string, string> {
  const timestamp = String(req.now ?? Date.now());
  const signature = computeSignature(secret, {
    timestamp,
    method: req.method,
    path: req.path,
    query: canonicalQuery(req.query),
    body: req.body ?? "",
  });
  return {
    authorization: `${AUTH_SCHEME} ${signature}`,
    [TIMESTAMP_HEADER]: timestamp,
    [CONTRACT_HEADER]: "1",
  };
}

export type AuthResult = { ok: true } | { ok: false; status: 400 | 401; code: string; message: string };

/** Verifies an incoming request (site side). Constant-time compare, fail closed. */
export function verifySignature(
  secret: string | undefined | null,
  req: {
    method: string;
    path: string;
    query: string;
    body: string;
    timestamp: string | null;
    authorization: string | null;
    now?: number;
  },
): AuthResult {
  if (!secret || secret.length < MIN_SECRET_LENGTH)
    return { ok: false, status: 401, code: "secret_unset", message: `Adapter secret is not set or shorter than ${MIN_SECRET_LENGTH} chars.` };

  if (!req.timestamp || !/^\d{10,16}$/.test(req.timestamp))
    return { ok: false, status: 401, code: "missing_timestamp", message: `Missing or malformed ${TIMESTAMP_HEADER} header.` };
  const ts = Number(req.timestamp);
  const now = req.now ?? Date.now();
  if (Math.abs(now - ts) > MAX_SKEW_MS)
    return { ok: false, status: 401, code: "stale_timestamp", message: "Timestamp outside the 5 minute window. Check the clock." };

  const m = /^HMAC-SHA256\s+([0-9a-f]{64})$/i.exec((req.authorization ?? "").trim());
  if (!m || !m[1]) return { ok: false, status: 401, code: "missing_signature", message: "Missing Authorization: HMAC-SHA256 <hex>." };

  const expected = Buffer.from(
    computeSignature(secret, { timestamp: req.timestamp, method: req.method, path: req.path, query: req.query, body: req.body }),
    "hex",
  );
  const given = Buffer.from(m[1].toLowerCase(), "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return { ok: false, status: 401, code: "bad_signature", message: "Signature does not match." };
  return { ok: true };
}

/* ------------------------------------------------------------- jump-in links */

/**
 * One-click sign-in from the site's own admin into the hub ("Marketing" link).
 * The site signs a short-lived link with the same adapter secret:
 *
 *   GET <hub>/jump?project=<slug>&email=<user email>&nonce=<random>&next=<path>&ts=<unix ms>&sig=<hex>
 *   sig = hex(HMAC-SHA256(secret, canonicalString({ timestamp: ts, method: "GET",
 *         path: "/jump", query: canonicalQuery({ project, email, nonce, next }), body: "" })))
 *
 * The hub signs the email in only if that hub user already exists and is a
 * member of the project. Links expire after JUMP_MAX_AGE_MS and work once.
 * Create the link when the admin clicks (a server route that redirects), not
 * when the admin page renders.
 */
export const JUMP_PATH = "/jump";
export const JUMP_MAX_AGE_MS = 2 * 60 * 1000;

export interface JumpParams {
  project: string;
  email: string;
  nonce: string;
  /** Hub path to open after sign-in, e.g. "/p/kinderversicherer/inbox". */
  next?: string;
}

function jumpParts(p: JumpParams, ts: string): SignParts {
  const query = canonicalQuery({ project: p.project, email: p.email.trim().toLowerCase(), nonce: p.nonce, next: p.next ?? "" });
  return { timestamp: ts, method: "GET", path: JUMP_PATH, query, body: "" };
}

/** Site side: the signed hub URL for a signed-in site admin. */
export function jumpUrl(
  secret: string,
  hubUrl: string,
  p: Omit<JumpParams, "nonce"> & { nonce?: string; now?: number },
): string {
  if (!secret || secret.length < MIN_SECRET_LENGTH) throw new Error(`Adapter secret is not set or shorter than ${MIN_SECRET_LENGTH} chars.`);
  const nonce = p.nonce ?? randomBytes(16).toString("hex");
  const ts = String(p.now ?? Date.now());
  const params: JumpParams = { project: p.project, email: p.email.trim().toLowerCase(), nonce, next: p.next ?? "" };
  const sig = computeSignature(secret, jumpParts(params, ts));
  const q = new URLSearchParams({ project: params.project, email: params.email, nonce, ts, sig });
  if (params.next) q.set("next", params.next);
  return `${hubUrl.replace(/\/+$/, "")}${JUMP_PATH}?${q}`;
}

/** Hub side: checks a jump link's signature and age. Nonce reuse is the caller's job. */
export function verifyJump(
  secret: string | undefined | null,
  q: { project: string | null; email: string | null; nonce: string | null; next: string | null; ts: string | null; sig: string | null; now?: number },
): AuthResult {
  if (!secret || secret.length < MIN_SECRET_LENGTH)
    return { ok: false, status: 401, code: "secret_unset", message: "The project's adapter secret is not set." };
  if (!q.project || !q.email || !q.nonce || !/^[A-Za-z0-9_-]{16,128}$/.test(q.nonce))
    return { ok: false, status: 400, code: "bad_request", message: "project, email and nonce are required." };
  if (!q.ts || !/^\d{10,16}$/.test(q.ts)) return { ok: false, status: 401, code: "missing_timestamp", message: "Missing ts." };
  const age = (q.now ?? Date.now()) - Number(q.ts);
  if (age > JUMP_MAX_AGE_MS || age < -MAX_SKEW_MS)
    return { ok: false, status: 401, code: "stale_timestamp", message: "The link has expired. Click the link on the site again." };
  if (!q.sig || !/^[0-9a-f]{64}$/i.test(q.sig)) return { ok: false, status: 401, code: "missing_signature", message: "Missing sig." };
  const expected = Buffer.from(computeSignature(secret, jumpParts({ project: q.project, email: q.email, nonce: q.nonce, next: q.next ?? "" }, q.ts)), "hex");
  const given = Buffer.from(q.sig.toLowerCase(), "hex");
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return { ok: false, status: 401, code: "bad_signature", message: "Signature does not match." };
  return { ok: true };
}

// ---------------------------------------------------------------- server.ts

/**
 * The site side: one catch-all route handler for every adapter endpoint.
 *
 *   // app/api/hub/[...path]/route.ts
 *   export const runtime = "nodejs";
 *   export const dynamic = "force-dynamic";
 *   export const { GET, POST } = createAdapterHandler({
 *     secret: process.env.GROWTH_HUB_SECRET,
 *     handlers: { listContent, getContent, upsertDraft, publish },
 *   });
 *
 * Routes (relative to the mount point):
 *   GET  /health                       -> HealthResult
 *   GET  /content?type&cursor&limit    -> Page<ContentItem>
 *   GET  /content/:id                  -> { item: ContentDetail }
 *   POST /drafts          DraftInput   -> DraftResult
 *   POST /publish/:id     PublishInput -> PublishResult
 *   GET  /conversions?since&cursor&limit -> Page<Conversion>
 *
 * Every request must be signed (see auth.ts). A handler that is not provided
 * answers 501. Errors are JSON { error, code }. Handler output is validated, so
 * an integration bug surfaces as a clear 500 instead of bad data in the hub.
 */

export class AdapterError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "AdapterError";
  }
}

/** Throw from a handler: `throw notFound()` / `throw conflict("published item")`. */
export const notFound = (what = "Content") => new AdapterError(404, "not_found", `${what} not found.`);
export const conflict = (message: string) => new AdapterError(409, "conflict", message);
export const badRequest = (message: string) => new AdapterError(400, "invalid_input", message);

export interface AdapterHandlers {
  /** Inventory. Return an array (the adapter pages it) or a page with your own cursor. */
  listContent?: (p: ListContentParams) => Promise<ContentItem[] | Page<ContentItem>>;
  /** One item with its body, or null when unknown. */
  getContent?: (id: string) => Promise<ContentDetail | null>;
  /** Create or update a DRAFT. Must never change what the public sees. */
  upsertDraft?: (input: DraftInput) => Promise<DraftResult>;
  /** Make a draft live. Called only with a hub approval id. Revalidate caches here. */
  publish?: (id: string, approval: PublishInput) => Promise<PublishResult>;
  /** Set search visibility after approval; keep the page accessible. */
  noindex?: (id: string, input: NoindexInput) => Promise<NoindexResult>;
  /** Serve an HTTP 301 to a published inventory page, after approval. */
  redirect?: (id: string, input: RedirectInput) => Promise<RedirectResult>;
  /** Goal events since a date. Return an array (paged for you) or a page. */
  conversions?: (p: ConversionsParams) => Promise<Conversion[] | Page<Conversion>>;
  /** Extra fields for GET /health, e.g. { site: "example.com" }. */
  health?: () => Promise<Record<string, unknown>>;
}

export interface AdapterOptions {
  /** The shared secret (GROWTH_HUB_SECRET). Unset or short = every request is refused. */
  secret: string | undefined | null;
  handlers: AdapterHandlers;
  /** Where the catch-all is mounted. Only used when the route context has no params. Default "/api/hub". */
  basePath?: string;
  /** Max request body. Default 2 MB. */
  maxBodyBytes?: number;
  /** Called with unexpected errors (not AdapterError). Default: console.error. */
  onError?: (err: unknown, route: string) => void;
}

type RouteCtx = { params?: Promise<{ path?: string | string[] }> | { path?: string | string[] } } | undefined;
type RouteFn = (req: Request, ctx?: RouteCtx) => Promise<Response>;

const CAPABILITIES = ["listContent", "getContent", "upsertDraft", "publish", "conversions", "noindex", "redirect"] as const;

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", [CONTRACT_HEADER]: String(CONTRACT_VERSION) },
  });
}

const fail = (status: number, code: string, error: string) => json(status, { error, code });

function invalidOutput(handler: string, issues: string[]): AdapterError {
  return new AdapterError(500, "invalid_handler_output", `${handler} returned invalid data: ${issues.slice(0, 5).join("; ")}`);
}

function clampInt(v: string | null, def: number, min: number, max: number): number {
  const n = v === null ? def : Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def;
}

/** Pages a plain array with an offset cursor, so simple sites can just return everything. */
function pageOf<T>(result: T[] | Page<T>, cursor: string | undefined, limit: number): Page<T> {
  if (!Array.isArray(result)) return { items: result.items, nextCursor: result.nextCursor ?? null };
  const start = cursor && /^\d+$/.test(cursor) ? Number(cursor) : 0;
  const items = result.slice(start, start + limit);
  return { items, nextCursor: start + limit < result.length ? String(start + limit) : null };
}

/** The route path relative to the mount point, raw (still percent-encoded). */
async function routePath(req: Request, ctx: RouteCtx, basePath: string): Promise<string> {
  const pathname = new URL(req.url).pathname.replace(/\/+$/, "");
  const params = ctx?.params ? await ctx.params : undefined;
  const seg = params?.path;
  if (seg !== undefined) {
    const n = Array.isArray(seg) ? seg.length : 1;
    const parts = pathname.split("/");
    return "/" + parts.slice(parts.length - n).join("/");
  }
  const base = basePath.replace(/\/+$/, "");
  if (pathname === base) return "/";
  if (pathname.startsWith(base + "/")) return pathname.slice(base.length);
  return pathname;
}

async function readBody(req: Request, max: number): Promise<string | null> {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > max) return null;
  const text = await req.text();
  return Buffer.byteLength(text, "utf8") > max ? null : text;
}

function decodeId(raw: string | undefined): string {
  if (!raw) throw new AdapterError(400, "invalid_input", "Missing id in path.");
  try {
    return decodeURIComponent(raw);
  } catch {
    throw new AdapterError(400, "invalid_input", "Malformed id in path.");
  }
}

function parseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    throw new AdapterError(400, "invalid_json", "Body is not valid JSON.");
  }
}

export function createAdapterHandler(opts: AdapterOptions): { GET: RouteFn; POST: RouteFn; handle: RouteFn } {
  const { handlers } = opts;
  const basePath = opts.basePath ?? "/api/hub";
  const maxBody = opts.maxBodyBytes ?? 2 * 1024 * 1024;
  const onError = opts.onError ?? ((err, route) => console.error(`[growth-hub-adapter] ${route}:`, err));

  const handle: RouteFn = async (req, ctx) => {
    const method = req.method.toUpperCase();
    let path = "/";
    try {
      path = await routePath(req, ctx, basePath);
      const url = new URL(req.url);

      if (method !== "GET" && method !== "POST") return fail(405, "method_not_allowed", "Only GET and POST.");
      const contract = req.headers.get(CONTRACT_HEADER);
      if (contract && contract !== String(CONTRACT_VERSION))
        return fail(400, "unsupported_contract", `This adapter speaks contract ${CONTRACT_VERSION}, request asked for ${contract}.`);

      const body = method === "POST" ? await readBody(req, maxBody) : "";
      if (body === null) return fail(413, "payload_too_large", `Body exceeds ${maxBody} bytes.`);

      const auth = verifySignature(opts.secret, {
        method,
        path,
        query: canonicalQuery(url.searchParams),
        body,
        timestamp: req.headers.get(TIMESTAMP_HEADER),
        authorization: req.headers.get("authorization"),
      });
      if (!auth.ok) return fail(auth.status, auth.code, auth.message);

      const parts = path.split("/").filter(Boolean);
      const [head, idPart, extra] = parts;
      const q = url.searchParams;
      const missing = (name: string) => fail(501, "not_implemented", `This site does not implement ${name}.`);
      const wrong = () => fail(405, "method_not_allowed", `${method} ${path} is not allowed.`);

      if (parts.length > 3 || (extra !== undefined && (head !== "content" || !["noindex", "redirect"].includes(extra)))) return fail(404, "not_found", `No route ${path}.`);

      switch (head) {
        case "health": {
          if (method !== "GET") return wrong();
          const extraInfo = handlers.health ? await handlers.health() : {};
          return json(200, {
            ...extraInfo,
            ok: true,
            contract: CONTRACT_VERSION,
            capabilities: CAPABILITIES.filter((c) => typeof handlers[c] === "function"),
          });
        }

        case "content": {
          if (extra) {
            if (method !== "POST") return wrong();
            const id = decodeId(idPart);
            if (extra === "noindex") {
              if (!handlers.noindex) return missing("noindex");
              const input = parseNoindexInput(parseJson(body));
              if (!input.ok) return json(400, { error: input.issues.join("; "), code: "invalid_input", issues: input.issues });
              const out = parseNoindexResult(await handlers.noindex(id, input.value));
              if (!out.ok) throw invalidOutput("noindex", out.issues);
              return json(200, out.value);
            }
            if (!handlers.redirect) return missing("redirect");
            if (!handlers.listContent || !handlers.getContent) return missing("redirect inventory checks");
            const input = parseRedirectInput(parseJson(body));
            if (!input.ok) return json(400, { error: input.issues.join("; "), code: "invalid_input", issues: input.issues });
            const source = await handlers.getContent(id);
            if (!source || source.status !== "published") throw badRequest("Redirect source must be a published inventory page.");
            const target = contentUrlKey(input.value.to);
            if (target === contentUrlKey(source.url)) throw badRequest("A page cannot redirect to itself.");
            let cursor: string | undefined;
            const seen = new Set<string>();
            let found = false;
            do {
              const page = pageOf(await handlers.listContent({ limit: 500, cursor }), cursor, 500);
              found = page.items.some((item) => item.status === "published" && item.id !== id && contentUrlKey(item.url) === target && !item.meta?.redirectTo);
              if (found) break;
              cursor = page.nextCursor ?? undefined;
              if (cursor && seen.has(cursor)) throw badRequest("Inventory cursor repeated; cannot validate redirect target.");
              if (cursor) seen.add(cursor);
            } while (cursor);
            if (!found) throw badRequest("Redirect target must be a published page in the inventory, without a redirect.");
            const out = parseRedirectResult(await handlers.redirect(id, input.value));
            if (!out.ok) throw invalidOutput("redirect", out.issues);
            return json(200, out.value);
          }
          if (method !== "GET") return wrong();
          if (idPart === undefined) {
            if (!handlers.listContent) return missing("listContent");
            const type = q.get("type") ?? undefined;
            if (type && !(CONTENT_TYPES as readonly string[]).includes(type))
              return fail(400, "invalid_input", `type must be one of ${CONTENT_TYPES.join(", ")}.`);
            const limit = clampInt(q.get("limit"), 100, 1, 500);
            const cursor = q.get("cursor") ?? undefined;
            const page = pageOf(await handlers.listContent({ type: type as ContentType | undefined, cursor, limit }), cursor, limit);
            const items = parseList(page.items, parseContentItem);
            if (!items.ok) throw invalidOutput("listContent", items.issues);
            return json(200, { items: items.value, nextCursor: page.nextCursor });
          }
          if (!handlers.getContent) return missing("getContent");
          const item = await handlers.getContent(decodeId(idPart));
          if (!item) return fail(404, "not_found", "Content not found.");
          const parsed = parseContentDetail(item);
          if (!parsed.ok) throw invalidOutput("getContent", parsed.issues);
          return json(200, { item: parsed.value });
        }

        case "drafts": {
          if (method !== "POST") return wrong();
          if (idPart !== undefined) return fail(404, "not_found", `No route ${path}.`);
          if (!handlers.upsertDraft) return missing("upsertDraft");
          const input = parseDraftInput(parseJson(body));
          if (!input.ok) return json(400, { error: `Invalid draft: ${input.issues.join("; ")}`, code: "invalid_input", issues: input.issues });
          const out = parseDraftResult(await handlers.upsertDraft(input.value));
          if (!out.ok) throw invalidOutput("upsertDraft", out.issues);
          return json(200, out.value);
        }

        case "publish": {
          if (method !== "POST") return wrong();
          if (!handlers.publish) return missing("publish");
          const id = decodeId(idPart);
          const input = parsePublishInput(parseJson(body));
          if (!input.ok) return json(400, { error: `Invalid publish request: ${input.issues.join("; ")}`, code: "approval_required", issues: input.issues });
          const out = parsePublishResult(await handlers.publish(id, input.value));
          if (!out.ok) throw invalidOutput("publish", out.issues);
          return json(200, out.value);
        }

        case "conversions": {
          if (method !== "GET") return wrong();
          if (idPart !== undefined) return fail(404, "not_found", `No route ${path}.`);
          if (!handlers.conversions) return missing("conversions");
          const since = q.get("since");
          if (!since || Number.isNaN(Date.parse(since))) return fail(400, "invalid_input", "since (ISO 8601) is required.");
          const limit = clampInt(q.get("limit"), 500, 1, 1000);
          const cursor = q.get("cursor") ?? undefined;
          const page = pageOf(await handlers.conversions({ since, cursor, limit }), cursor, limit);
          const items = parseList(page.items, parseConversion);
          if (!items.ok) throw invalidOutput("conversions", items.issues);
          return json(200, { items: items.value, nextCursor: page.nextCursor });
        }

        default:
          return fail(404, "not_found", `No route ${path}.`);
      }
    } catch (err) {
      if (err instanceof AdapterError) {
        if (err.status >= 500) onError(err, `${method} ${path}`);
        return fail(err.status, err.code, err.message);
      }
      onError(err, `${method} ${path}`);
      return fail(500, "internal", "Internal error in the site adapter.");
    }
  };

  return { GET: handle, POST: handle, handle };
}

// ---------------------------------------------------------------- client.ts

/**
 * The hub side: a typed client for one site's adapter. Signs every request,
 * times out, retries once on 5xx (except 501) / network errors (every endpoint is
 * idempotent), and validates what the site returns.
 */

export class AdapterClientError extends Error {
  constructor(
    message: string,
    /** HTTP status, 0 for network errors and timeouts. */
    public status: number,
    /** The adapter's error code (not_found, not_implemented, bad_signature, ...). */
    public code: string,
  ) {
    super(message);
    this.name = "AdapterClientError";
  }
}

export interface AdapterClientOptions {
  /** e.g. https://example.com/api/hub (no trailing slash needed). */
  baseUrl: string;
  secret: string;
  /** Per attempt. Default 20 s. */
  timeoutMs?: number;
  /** Retries after the first attempt on 5xx / network errors. Default 1. */
  retries?: number;
  fetch?: typeof fetch;
}

export interface AdapterClient {
  health(): Promise<HealthResult>;
  listContent(p?: { type?: ContentType; cursor?: string; limit?: number }): Promise<Page<ContentItem>>;
  /** Follows cursors until the end (or maxItems). */
  listAllContent(p?: { type?: ContentType; maxItems?: number }): Promise<ContentItem[]>;
  getContent(id: string): Promise<ContentDetail | null>;
  upsertDraft(input: DraftInput): Promise<DraftResult>;
  publish(id: string, approval: PublishInput): Promise<PublishResult>;
  noindex(id: string, input: NoindexInput): Promise<NoindexResult>;
  redirect(id: string, input: RedirectInput): Promise<RedirectResult>;
  conversions(p: { since: string; cursor?: string; limit?: number }): Promise<Page<Conversion>>;
  /** Follows cursors until the end (or maxItems). */
  allConversions(p: { since: string; maxItems?: number }): Promise<Conversion[]>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function check<T>(what: string, p: { ok: true; value: T } | { ok: false; issues: string[] }): T {
  if (!p.ok) throw new AdapterClientError(`Site returned invalid ${what}: ${p.issues.slice(0, 5).join("; ")}`, 502, "invalid_response");
  return p.value;
}

function pageShape(data: unknown): { items: unknown; nextCursor: string | null } {
  const d = (data ?? {}) as { items?: unknown; nextCursor?: unknown };
  return { items: d.items, nextCursor: typeof d.nextCursor === "string" && d.nextCursor ? d.nextCursor : null };
}

export function createAdapterClient(opts: AdapterClientOptions): AdapterClient {
  const base = opts.baseUrl.replace(/\/+$/, "");
  const timeoutMs = opts.timeoutMs ?? 20_000;
  const retries = opts.retries ?? 1;
  const doFetch = opts.fetch ?? fetch;

  async function call(method: "GET" | "POST", path: string, query?: QueryInput, payload?: unknown): Promise<unknown> {
    const body = payload === undefined ? "" : JSON.stringify(payload);
    const qs = canonicalQuery(query);
    const url = `${base}${path}${qs ? `?${qs}` : ""}`;
    let lastErr: AdapterClientError | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) await sleep(400 * attempt);
      // Re-sign per attempt: a fresh timestamp.
      const headers: Record<string, string> = { accept: "application/json", ...signRequest(opts.secret, { method, path, query, body }) };
      if (method === "POST") headers["content-type"] = "application/json";
      let res: Response;
      try {
        res = await doFetch(url, { method, headers, body: method === "POST" ? body : undefined, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
      } catch (e) {
        const timeout = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
        lastErr = new AdapterClientError(
          timeout ? `Site adapter timed out after ${timeoutMs} ms (${method} ${path}).` : `Site adapter unreachable (${method} ${path}): ${e instanceof Error ? e.message : String(e)}`,
          0,
          timeout ? "timeout" : "network",
        );
        continue;
      }
      const text = await res.text();
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }
      if (res.ok) {
        if (data === null) throw new AdapterClientError(`Site adapter returned non-JSON (${method} ${path}).`, res.status, "invalid_response");
        return data;
      }
      const err = (data ?? {}) as { error?: unknown; code?: unknown };
      lastErr = new AdapterClientError(
        typeof err.error === "string" ? err.error : `Site adapter HTTP ${res.status} (${method} ${path}).`,
        res.status,
        typeof err.code === "string" ? err.code : `http_${res.status}`,
      );
      if (res.status < 500 || res.status === 501) throw lastErr; // 501 = not implemented, retrying cannot help
    }
    throw lastErr ?? new AdapterClientError("Site adapter failed.", 0, "network");
  }

  const enc = encodeURIComponent;

  const client: AdapterClient = {
    async health() {
      const d = (await call("GET", "/health")) as HealthResult;
      if (d?.ok !== true || !Array.isArray(d.capabilities)) throw new AdapterClientError("Site returned an invalid health response.", 502, "invalid_response");
      return d;
    },

    async listContent(p = {}) {
      const page = pageShape(await call("GET", "/content", { type: p.type, cursor: p.cursor, limit: p.limit ?? 100 }));
      return { items: check("content list", parseList(page.items, parseContentItem)), nextCursor: page.nextCursor };
    },

    async listAllContent(p = {}) {
      const max = p.maxItems ?? 20_000;
      const out: ContentItem[] = [];
      let cursor: string | undefined;
      const seen = new Set<string>();
      do {
        const page = await client.listContent({ type: p.type, cursor, limit: 500 });
        out.push(...page.items);
        cursor = page.nextCursor ?? undefined;
        if (cursor && seen.has(cursor)) throw new AdapterClientError("Site adapter returned a repeating cursor.", 502, "invalid_response");
        if (cursor) seen.add(cursor);
      } while (cursor && out.length < max);
      return out.slice(0, max);
    },

    async getContent(id) {
      try {
        const d = (await call("GET", `/content/${enc(id)}`)) as { item?: unknown };
        return check("content item", parseContentDetail(d?.item));
      } catch (e) {
        if (e instanceof AdapterClientError && e.status === 404) return null;
        throw e;
      }
    },

    async upsertDraft(input) {
      const v = parseDraftInput(input);
      if (!v.ok) throw new AdapterClientError(`Invalid draft: ${v.issues.join("; ")}`, 400, "invalid_input");
      return check("draft result", parseDraftResult(await call("POST", "/drafts", undefined, v.value)));
    },

    async publish(id, approval) {
      if (!approval?.approvalId) throw new AdapterClientError("publish needs an approvalId.", 400, "approval_required");
      return check("publish result", parsePublishResult(await call("POST", `/publish/${enc(id)}`, undefined, approval)));
    },

    async noindex(id, input) {
      const v = parseNoindexInput(input);
      if (!v.ok) throw new AdapterClientError(`Invalid noindex request: ${v.issues.join("; ")}`, 400, "invalid_input");
      return check("noindex result", parseNoindexResult(await call("POST", `/content/${enc(id)}/noindex`, undefined, v.value)));
    },

    async redirect(id, input) {
      const v = parseRedirectInput(input);
      if (!v.ok) throw new AdapterClientError(`Invalid redirect request: ${v.issues.join("; ")}`, 400, "invalid_input");
      return check("redirect result", parseRedirectResult(await call("POST", `/content/${enc(id)}/redirect`, undefined, v.value)));
    },

    async conversions(p) {
      const page = pageShape(await call("GET", "/conversions", { since: p.since, cursor: p.cursor, limit: p.limit ?? 1000 }));
      return { items: check("conversions", parseList(page.items, parseConversion)), nextCursor: page.nextCursor };
    },

    async allConversions(p) {
      const max = p.maxItems ?? 50_000;
      const out: Conversion[] = [];
      let cursor: string | undefined;
      do {
        const page = await client.conversions({ since: p.since, cursor, limit: 1000 });
        out.push(...page.items);
        cursor = page.nextCursor ?? undefined;
      } while (cursor && out.length < max);
      return out.slice(0, max);
    },
  };
  return client;
}
