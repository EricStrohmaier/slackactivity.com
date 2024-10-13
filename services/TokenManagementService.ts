import { jwtDecode } from "jwt-decode";
import { supabaseAdmin } from "@/utils/supabase/admin";

export class TokenManagementService {
  private static instance: TokenManagementService;

  private constructor() {}

  public static getInstance(): TokenManagementService {
    if (!TokenManagementService.instance) {
      TokenManagementService.instance = new TokenManagementService();
    }
    return TokenManagementService.instance;
  }

  async getValidAccessToken(userId: string): Promise<string> {
    const supabase = supabaseAdmin();
    const { data: tokenData, error } = await supabase
      .from("ms_token_info")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !tokenData) {
      throw new Error("No token found for user");
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return this.refreshToken(userId, tokenData.refresh_token);
    }

    return tokenData.access_token;
  }

  private async refreshToken(
    userId: string,
    refreshToken: string
  ): Promise<string> {
    try {
      const response = await fetch(
        "https://login.microsoftonline.com/common/oauth2/v2.0/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.AZURE_CLIENT_ID!,
            client_secret: process.env.AZURE_CLIENT_SECRET!,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || "Failed to refresh token");
      }

      const decodedToken: any = jwtDecode(data.access_token);
      const expiresAt = new Date(decodedToken.exp * 1000);
      const supabase = supabaseAdmin();
      const { error } = await supabase
        .from("ms_token_info")
        .update({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", userId);

      if (error) {
        throw new Error("Failed to update token in database");
      }

      return data.access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  async saveTokenData(userId: string, tokenData: any) {
    const supabase = supabaseAdmin();
    const decodedToken: any = jwtDecode(tokenData.access_token);
    const expiresAt = new Date(decodedToken.exp * 1000);

    // Use upsert to either insert a new record or update an existing one
    const { error } = await supabase.from("ms_token_info").upsert(
      {
        user_id: userId,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt.toISOString(),
      },
      { onConflict: "user_id" } // This specifies which column to check for conflicts
    );

    if (error) {
      console.error("Error saving token data:", error);
      throw new Error("Failed to save token data: " + error.message);
    }
  }
}
