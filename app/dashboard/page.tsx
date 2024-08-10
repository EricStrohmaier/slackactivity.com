import Dashboard from "@/components/app/dashboard/dashboard";
import React from "react";
import { getSupabaseServer, getUser } from "../action";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default async function page({ searchParams }: { searchParams: any }) {
  const user = await getUser();

  if (!user) redirect("/signin");

  const supabase = supabaseAdmin();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error(error);
    return <div className="h-screen">Error Couldnt find you in the system</div>;
  }

  return (
    <div className="h-screen">
      <Dashboard user={data} />
    </div>
  );
}
