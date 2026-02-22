"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageHeaderProps = {
  backHref?: string;
};

export const PageHeader = ({ backHref }: PageHeaderProps) => (
  <header className="border-b border-border px-6 py-4 flex items-center gap-3">
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
  </header>
);
