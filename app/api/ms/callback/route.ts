import { NextRequest, NextResponse } from "next/server";
import { TokenManagementService } from "@/services/TokenManagementService";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { jwtDecode } from "jwt-decode";
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";

const supabaseAdminClient = supabaseAdmin();

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 }
    );
  }

  // TODO: Verify the state value against the one stored earlier
  // if (!await verifyState(state)) {
  //   return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  // }

  const tokenResponse = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID!,
        client_secret: process.env.AZURE_CLIENT_SECRET!,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.NEXT_PUBLIC_MS_TEAMS_REDIRECT_URI!,
      }),
    }
  );

  const data = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(data.error_description || "Failed to get token");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("User not authenticated, redirecting to signin page");
    return redirect(
      getErrorRedirect(
        "/signin",
        "User not authenticated",
        "Please sign in to continue"
      )
    );
  }

  const tokenManagementService = TokenManagementService.getInstance();
  await tokenManagementService.saveTokenData(user.id, data);

  // Store the token data temporarily
  const { error } = await supabaseAdminClient
    .from("temp_tokens")
    .insert({ state, token_data: data });

  if (error) {
    throw new Error("Failed to store temporary token data: " + error.message);
  }
  // Update or create the workspace
  const { data: workspace, error: workspaceError } = await supabaseAdminClient
    .from("workspace")
    .upsert(
      {
        user_id: user.id,
        team_id: "Ms Teams",
        is_active: true,
      },
      {
        onConflict: "team_id",
      }
    )
    .select()
    .single();

  if (workspaceError) {
    throw new Error("Failed to update workspace: " + workspaceError.message);
  }

  // Redirect to a success page
  return redirect("/api/ms/complete-auth?state=" + state);
}
