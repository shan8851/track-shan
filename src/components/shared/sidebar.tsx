"use client";

import {
  ClipboardCheck,
  Dumbbell,
  Home,
  PenLine,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/checkin", label: "Check-in", icon: ClipboardCheck },
  { href: "/weight", label: "Weight", icon: Scale },
  { href: "/exercise", label: "Exercise", icon: Dumbbell },
  { href: "/writing", label: "Writing", icon: PenLine },
] as const;

const isActiveRoute = (pathname: string, href: string): boolean =>
  href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

export const Sidebar = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);

  const isExpanded = isHovered || isPinnedOpen;

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-14 flex-col border-r border-border bg-chrome-800/95 backdrop-blur-sm transition-[width] duration-200 ease-out",
        isExpanded && "md:w-[200px]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className={cn(
          "flex h-14 items-center border-b border-border text-terminal transition-colors hover:bg-accent",
          isExpanded ? "justify-start px-4" : "justify-center px-0",
        )}
        onClick={() => setIsPinnedOpen((currentState) => !currentState)}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="text-base font-bold">$</span>
        <span
          className={cn(
            "hidden overflow-hidden whitespace-nowrap pl-3 text-sm font-semibold tracking-wide transition-[width,opacity] duration-200 md:block",
            isExpanded ? "w-auto opacity-100" : "w-0 opacity-0",
          )}
        >
          track-shan
        </span>
      </button>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center border border-transparent text-sm transition-colors",
                isExpanded ? "justify-start px-3" : "justify-center px-0",
                active ?
                  "bg-terminal/10 text-terminal" :
                  "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span
                className={cn(
                  "hidden overflow-hidden whitespace-nowrap pl-3 transition-[width,opacity] duration-200 md:block",
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
