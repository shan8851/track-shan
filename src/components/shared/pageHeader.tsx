"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/weight", label: "weight" },
  { href: "/exercise", label: "exercise" },
] as const;

type PageHeaderProps = {
  backHref?: string;
};

export const PageHeader = ({ backHref }: PageHeaderProps) => {
  const pathname = usePathname();

  return (
    <header className="border-b border-border px-6 py-4 flex items-center gap-6">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className="text-muted-foreground hover:text-terminal transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <h1 className="text-xl font-bold">
          <Link href="/" className="hover:text-terminal transition-colors">
            <span className="text-muted-foreground">$</span>{" "}
            <span className="text-terminal">track-shan</span>
          </Link>
        </h1>
      </div>
      <nav className="flex items-center gap-4">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors ${
              pathname === link.href
                ? "text-terminal"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
