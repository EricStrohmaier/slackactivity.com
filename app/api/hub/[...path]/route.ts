import { createAdapterHandler } from "@/lib/growth-hub-adapter";
import { hubHandlers } from "@/lib/hub";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Growth Hub site adapter. Every request is HMAC-signed with GROWTH_HUB_SECRET. */
export const { GET, POST } = createAdapterHandler({
  secret: process.env.GROWTH_HUB_SECRET,
  handlers: hubHandlers,
});
