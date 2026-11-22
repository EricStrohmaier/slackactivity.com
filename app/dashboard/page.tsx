import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getUserWorkspaces } from "@/lib/db/queries";
import DashboardSelector from "@/components/app/dashboard/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/signin");

  const workspaces = await getUserWorkspaces(user.id);

  return (
    <div className="w-full overflow-x-hidden px-4 pb-8 sm:px-6 md:px-8">
      <DashboardSelector user={user} workspaces={workspaces} />
    </div>
  );
}
