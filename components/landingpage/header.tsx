"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { landingpageContent } from "@/constants/landingpage";
import { UserNav } from "../app/UserNav";
import { Container } from "@/components/landingpage/container";
import { User } from "@/types/supabase";

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <PopoverButton as={Link} href={href} className="block py-2">
        {children}
      </PopoverButton>
    </li>
  );
}

function MobileNavigation(
  props: React.ComponentPropsWithoutRef<typeof Popover>
) {
  // Filter the active links
  const activeLinks = landingpageContent.header.NavAndFooterLinks.filter(
    (link) => link.active
  );

  // Return null if there are no active links
  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <Popover {...props}>
      <PopoverButton className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
        Menu
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm duration-150 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-black/80"
      />
      <PopoverPanel
        focus
        transition
        className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 duration-150 data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-900 dark:ring-zinc-800"
      >
        <div className="flex flex-row-reverse items-center justify-between">
          <PopoverButton aria-label="Close menu" className="-m-1 p-1">
            <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
          </PopoverButton>
          <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Navigation
          </h2>
        </div>
        <nav className="mt-6">
          <ul className="-my-2 divide-y divide-zinc-100 text-base text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
            {activeLinks.map((link) => (
              <MobileNavItem key={link.text} href={link.href}>
                {link.text}
              </MobileNavItem>
            ))}
          </ul>
        </nav>
      </PopoverPanel>
    </Popover>
  );
}

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  let isActive = usePathname() === href;

  return (
    <li>
      <Link
        href={href}
        className={clsx(
          "relative block px-3 py-2 transition whitespace-nowrap",
          isActive
            ? "text-accent-400 dark:text-accent-400"
            : "hover:text-accent dark:hover:text-accent-400"
        )}
      >
        <span className="inline-block">{children}</span>
        {isActive && (
          <span className="absolute -inset-x-[10.5px] -bottom-[2px] h-[2.5px] bg-gradient-to-r from-accent-500/0 via-accent-500/40 to-accent-500/0 dark:from-accent-400/0 dark:via-accent-400/40 dark:to-accent-400/0" />
        )}
      </Link>
    </li>
  );
}

function DesktopNavigation(props: React.ComponentPropsWithoutRef<"nav">) {
  const activeLinks = landingpageContent.header.NavAndFooterLinks.filter(
    (link) => link.active
  );
  // Return null if there are no active links
  if (activeLinks.length === 0) {
    return null;
  }

  return (
    <nav {...props}>
      <ul className="h-11 flex rounded-full bg-white/90 px-5 text-md lg:text-lg font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10">
        {activeLinks.map((link) => (
          <NavItem key={link.text} href={link.href}>
            {link.text}
          </NavItem>
        ))}
      </ul>
    </nav>
  );
}

export function Header({ user }: { user: User | null }) {
  const isAbout = usePathname() === "/about";

  const pathname = usePathname();
  if (pathname.includes("/signin")) {
    return null;
  }

  return (
    <>
      <header className="top-0 left-0 right-0 z-50 h-24  pt-6">
        <Container className="w-full">
          <div className="relative flex gap-4">
            <div className="flex flex-1">
              <Link href={landingpageContent.header.company.logoHref || "/"}>
                <Image
                  src={landingpageContent.header.company.logo}
                  alt={`${landingpageContent.header.company.name} logo`}
                  className="md:h-20 md:w-20 h-12 w-12 bg-transparent cursor-pointer"
                />
              </Link>
            </div>
            <div className="flex flex-1 justify-end md:justify-center">
              <MobileNavigation className="pointer-events-auto md:hidden" />
              <DesktopNavigation className="pointer-events-auto hidden md:block" />
            </div>
            <div className="flex justify-end md:flex-1">
              {user ? (
                <UserNav user={user} />
              ) : (
                landingpageContent.header.button.active && (
                  <Button asChild variant="landingpageCTA" size="lg">
                    <Link href={landingpageContent.header.button.href}>
                      {landingpageContent.header.button.text}
                    </Link>
                  </Button>
                )
              )}
              {isAbout && (
                <Button asChild variant="ghost">
                  <Link href={"/signin"}>Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </Container>
      </header>
    </>
  );
}
