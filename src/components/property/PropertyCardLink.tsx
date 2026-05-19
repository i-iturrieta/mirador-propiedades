"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface Props {
  href: string;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

export function PropertyCardLink({ href, ariaLabel, className, children }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={() => setIsLoading(true)}
    >
      {children}

      {/* Loading overlay */}
      <div
        className={`absolute inset-0 bg-black/25 transition-opacity duration-200 pointer-events-none ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      {/* Top-right action button */}
      <span className="absolute top-4 right-4 hidden md:inline-flex h-9 w-9 items-center justify-center bg-white/0 group-hover:bg-white text-white group-hover:text-fg transition-colors duration-500 rounded-sm border border-white/0 group-hover:border-white">
        {isLoading ? (
          <span className="h-[18px] w-[18px] rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : (
          <ArrowUpRight size={15} strokeWidth={1.5} />
        )}
      </span>
    </Link>
  );
}
