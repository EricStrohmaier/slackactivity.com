"use client";
import { signOut } from "@/utils/auth-helpers/server";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function Signout() {
  const router = useRouter();
  async function handleLogoutClick() {
    const response = await signOut();

    if (response?.error) {
      toast.error(
        "An error occurred while logging out. Please try again or contact support."
      );
    } else {
      router.refresh();

      toast.success("You have been logged out.");
    }
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      className="inline-flex"
      onClick={handleLogoutClick}
    >
      Sign Out
    </Button>
  );
}
