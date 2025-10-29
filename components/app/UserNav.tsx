"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Signout from "@/components/auth-form/Signout";
import { User } from "@/types/supabase";

interface iAppProps {
  user: User;
}

export function UserNav({ user }: iAppProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="hidden sm:inline max-w-[140px] truncate text-sm text-muted-foreground md:max-w-[220px]">
        Welcome, {user.email}
      </span>

      <Button
        asChild
        variant="default"
        size="sm"
        className="inline-flex"
      >
        <Link href="/dashboard">Dashboard</Link>
      </Button>

      {/* Signout renders a clickable element; keep as-is for now */}

      <Signout />
    </div>
  );
}
