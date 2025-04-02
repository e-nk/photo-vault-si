
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center mr-8">
        <span className="text-2xl font-bold text-photo-purple">Photo-Vault</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/home"
          className={cn(
            "transition-colors hover:text-photo-secondary",
            pathname === "/home"
              ? "text-photo-secondary"
              : "text-photo-secondary/60"
          )}
        >
          Home
        </Link>
        <Link
          href="/my-albums"
          className={cn(
            "transition-colors hover:text-photo-secondary",
            pathname === "/my-albums"
              ? "text-photo-secondary"
              : "text-photo-secondary/60"
          )}
        >
          My Albums
        </Link>
        <Link
          href="/explore"
          className={cn(
            "transition-colors hover:text-photo-secondary",
            pathname === "/explore"
              ? "text-photo-secondary"
              : "text-photo-secondary/60"
          )}
        >
          Explore
        </Link>
      </nav>
    </div>
  );
}