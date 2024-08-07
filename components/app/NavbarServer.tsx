"use server";

import { getUser } from "@/app/app/action";
import { Navbar } from "@/components/app/Navbar";

export async function NavbarServer() {
  const user = await getUser();
  return <Navbar user={user} />;
}
