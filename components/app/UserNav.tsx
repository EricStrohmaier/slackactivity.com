"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Signout from "@/components/auth-form/Signout";
import { User } from "@/types/supabase";

interface iAppProps {
  user: User;
}

export function UserNav({ user }: iAppProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-12 w-12 rounded-full">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url as string} alt="User Image" />
            <AvatarFallback>
              <div className="h-full w-full bg-[linear-gradient(115deg,var(--tw-gradient-stops))] sm:bg-[linear-gradient(145deg,var(--tw-gradient-stops))] from-[#9ad4ae] 25% to-[#7fc8c9] 90% transition-all duration-500" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Signout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
