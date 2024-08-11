import Dashboard from "@/components/app/dashboard/dashboard";
import React from "react";
import { getSupabaseServer, getUser } from "../action";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default async function page({ searchParams }: { searchParams: any }) {
  const token = searchParams.get("token");
  const supabase = supabaseAdmin();

  const user = await getUser();

  if (!user) redirect("/signin");

  if (token) {
    const { data: updateUser, error: updateError } = await supabase
      .from("users")
      .update({
        slack_auth_token: token,
      })
      .eq("id", user.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  }

  const { data: selectUser, error: selectError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id);

  if (selectError) {
    console.log(selectError);

    return <div className="h-screen">Error Couldnt find you in the system</div>;
  }

  console.log("selectUser", selectUser);

  return (
    <div className="h-screen">
      <Dashboard user={selectUser as any} />
    </div>
  );
}
