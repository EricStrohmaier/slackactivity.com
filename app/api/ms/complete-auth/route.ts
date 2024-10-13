import { NextRequest, NextResponse } from "next/server";
import { TokenManagementService } from "@/services/TokenManagementService";
import { createClient } from "@/utils/supabase/server";
import { getErrorRedirect, getStatusRedirect } from "@/utils/helpers";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  return handleRequest(state);
}

export async function POST(req: NextRequest) {
  const { state } = await req.json();
  return handleRequest(state);
}

async function handleRequest(state: string | null) {
  if (!state) {
    console.log("State is missing, redirecting to error page");
    return redirect(
      getErrorRedirect("/", "Missing state", "State parameter is required")
    );
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

  const userId = user.id;
  const supabaseAd = supabaseAdmin();
  const { data: tempTokenData, error: fetchError } = await supabaseAd
    .from("temp_tokens")
    .select("token_data")
    .eq("state", state)
    .single();

  if (fetchError || !tempTokenData) {
    console.error("Failed to retrieve temporary token data:", fetchError);
    return redirect(
      getErrorRedirect(
        "/",
        "Authentication failed",
        "Failed to retrieve temporary token data"
      )
    );
  }

  const tokenManagementService = TokenManagementService.getInstance();
  try {
    await tokenManagementService.saveTokenData(
      userId,
      tempTokenData.token_data
    );
  } catch (error) {
    console.error("Failed to save token data:", error);
    return redirect(
      getErrorRedirect(
        "/",
        "Authentication failed",
        "Failed to save token data"
      )
    );
  }

  const { error: deleteError } = await supabaseAd
    .from("temp_tokens")
    .delete()
    .eq("state", state);

  if (deleteError) {
    console.error("Failed to delete temporary token data:", deleteError);
  } else {
    console.log("Temporary token data deleted successfully");
  }

  console.log("Authentication completed successfully");
  return redirect(
    getStatusRedirect("/", "Success", "Authentication successful")
  );
}
