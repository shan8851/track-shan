"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type PageHeaderProps = {
  backHref: string;
  title: string;
};

export const PageHeader = ({ backHref, title }: PageHeaderProps) => (
  <header className="border-b border-border bg-background/95 px-6 py-4 backdrop-blur-sm">
    <div className="mx-auto flex max-w-5xl items-center gap-3">
      <Link
        href={backHref}
        className="text-muted-foreground transition-colors hover:text-terminal"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <h1 className="text-lg font-bold text-terminal">{title}</h1>
    </div>
  </header>
);
