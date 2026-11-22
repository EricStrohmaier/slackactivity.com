import React from "react";
import { notFound } from "next/navigation";
import { isAdminUser } from "@/lib/auth";
import { getAdminStats } from "@/app/stats-actions";
import AdminDashboard from "@/components/app/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Hidden page: non-admins (and logged-out users) get a 404.
  if (!(await isAdminUser())) notFound();

  const initialStats = await getAdminStats(30);

  return (
    <div className="w-full px-4 pb-8 sm:px-6 md:px-8">
      <AdminDashboard initialStats={initialStats} initialDays={30} />
    </div>
  );
}
