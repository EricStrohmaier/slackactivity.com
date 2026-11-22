import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Liveness probe for the container healthcheck and uptime monitors. Touches no
 * database or third-party API, so it stays green when only Turso/Slack are down.
 */
export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request: NextRequest) {
  console.log("ping");

  const body = await request.json();

  console.log("Received:", body);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
