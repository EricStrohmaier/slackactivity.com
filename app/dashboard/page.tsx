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

  const { data: updateUser, error: updateError } = await supabase
    .from("users")
    .update({
      slack_auth_token: token,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  if (!updateUser) {
    return <div className="h-screen">Error Couldnt find you in the system</div>;
  }

  console.log(updateUser);

  return (
    <div className="h-screen">
      <Dashboard user={updateUser} />
    </div>
  );
}
