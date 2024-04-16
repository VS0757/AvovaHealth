"use client";

import Link from "next/link";
import Image from "next/image";
import NavigationLink from "./navigation_link";
import FeatherIcon from "feather-icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavigationBar() {
  const [small, setSmall] = useState<boolean>(false);

  const pathname = usePathname();

  const width = small ? "w-14" : "w-48";

  return (
    <div
      className={`flex min-h-full ${width} flex-col justify-between border-r bg-stone-50 dark:border-stone-800 dark:bg-stone-950`}
    >
      <Link
        href="/app"
        className="flex flex-row items-center gap-2 pl-3 pt-4 tracking-[.25em]"
      >
        <Image
          src="/Logomark.svg"
          alt="logo"
          width={32}
          height={128}
          className="opacity-70"
        />
        {small ? "" : "AVOVA"}
      </Link>
      <nav className="pl-4">
        <NavigationLink
          label="Home"
          icon="home"
          href="/app"
          small={small}
          active={pathname === "/app"}
        />
        <NavigationLink
          label="Analysis"
          icon="trending-up"
          href="/app/analysis"
          small={small}
          active={pathname === "/app/analysis"}
        />
        <NavigationLink
          label="Timeline"
          icon="git-commit"
          href="/app/timeline"
          small={small}
          active={
            pathname === "/app/timeline" || pathname.startsWith("/app/report")
          }
        />
        <NavigationLink
          label="Watchlist"
          icon="bookmark"
          href="/app/watchlist"
          small={small}
          active={pathname === "/app/watchlist"}
        />
        <NavigationLink
          label="Settings"
          icon="settings"
          href="/app/settings"
          small={small}
          active={pathname === "/app/settings"}
        />
      </nav>
      <button
        className="w-full"
        onClick={() => {
          if (small) {
            setSmall(false);
          } else {
            setSmall(true);
          }
        }}
      >
        <FeatherIcon icon="sidebar" className="mb-4 ml-4 h-4 opacity-70" />
      </button>
    </div>
  );
}
