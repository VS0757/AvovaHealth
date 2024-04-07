"use client";

import Link from "next/link";
import Image from "next/image";
import NavigationLink from "./navigation_link";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <div className="fixed flex min-h-full w-48 flex-col justify-between border-r bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
      <Link
        href="/app"
        className="flex flex-row items-center gap-2 pl-4 pt-4 tracking-[.25em]"
      >
        <Image
          src="/Logomark.svg"
          alt="logo"
          width={32}
          height={128}
          className="opacity-70"
        />
        AVOVA
      </Link>
      <nav className="pl-4">
        <NavigationLink
          label="Home"
          icon="home"
          href="/app"
          active={pathname === "/app"}
        />
        <NavigationLink
          label="Analysis"
          icon="trending-up"
          href="/app/analysis"
          active={pathname === "/app/analysis"}
        />
        <NavigationLink
          label="Timeline"
          icon="git-commit"
          href="/app/timeline"
          active={pathname === "/app/timeline"}
        />
        <NavigationLink
          label="Watchlist"
          icon="bookmark"
          href="/app/watchlist"
          active={pathname === "/app/watchlist"}
        />
        <NavigationLink
          label="Settings"
          icon="settings"
          href="/app/settings"
          active={pathname === "/app/settings"}
        />
      </nav>
      <div className="w-full">
        <FeatherIcon icon="sidebar" className="mb-4 ml-4 h-4 opacity-70" />
      </div>
    </div>
  );
}
