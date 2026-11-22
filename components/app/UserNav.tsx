import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignoutButton from "@/components/app/SignoutButton";
import { User } from "@/types/db";

export function UserNav({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground sm:inline md:max-w-[220px]">
        Welcome, {user.full_name || user.email || "there"}
      </span>

      <Button asChild variant="default" size="sm" className="inline-flex">
        <Link href="/dashboard">Dashboard</Link>
      </Button>

      <SignoutButton />
    </div>
  );
}
