import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from "@/app/action";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { stripe } from "@/lib/stripe";
import { siteConfig } from "@/config/site";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const priceId = req.nextUrl.searchParams.get("priceId");
  const mode = req.nextUrl.searchParams.get("mode");
  console.log("in token route priceId", priceId);
  console.log("in token route mode", mode);
  let redirectPath;

  if (!code) {
    redirectPath = getErrorRedirect(
      `/`,
      "Hmm... Something went wrong.",
      "Code not provided"
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Exchange code for access token
  const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code || "",
      client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI!,
    }),
  });

  const data = await tokenResponse.json();
  console.log("Slack OAuth data tokenResponse:", data);

  if (!data.ok) {
    redirectPath = getErrorRedirect(
      `/`,
      "You could not be signed in.",
      data.error
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Get the current user
  const user = await getUser();

  if (!user) {
    console.error("User not found");
    redirectPath = getErrorRedirect(
      `/signin`,
      "You are not authenticated.",
      ""
    );
    return redirect(redirectPath); // Ensure redirection
  }

  // Save the workspace info
  const supabase = supabaseAdmin();
  const workspaceId = uuidv4();
  const { error: upsertError } = await supabase.from("workspace").upsert({
    id: workspaceId,
    user_id: user?.id,
    slack_auth_token: data.authed_user.access_token,
    team_name: data.team.name,
    team_id: data.team.id,
    is_active: true,
    enterprise: data.team.enterprise,
    working_hours: {
      startHour: 9,
      endHour: 17,
      daysOfWeek: [1, 2, 3, 4, 5],
      timezone: "UTC",
    },
  });

  if (upsertError) {
    console.error("Error saving workspace:", upsertError);
    redirectPath = getErrorRedirect(
      `/`,
      "Something went wrong.",
      "Workspace could not be saved"
    );
    return redirect(redirectPath); // Ensure redirection
  } else {
    // Create a Stripe Checkout Session

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId || "",
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        workspace_id: workspaceId,
      },
      mode: (mode as any) || "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    });

    // Redirect to the Stripe checkout page
    return redirect(session.url || "/");
  }
}
