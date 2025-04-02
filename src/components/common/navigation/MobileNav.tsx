"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-photo-primary border-photo-border">
        <div className="flex flex-col h-full">
          <div className="px-2 py-6 flex items-center justify-between border-b border-photo-border/10">
            <span className="text-2xl font-bold text-photo-purple">Photo-Vault</span>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
          
          <div className="px-6 py-4">
            <div className="text-sm text-photo-secondary/60 mb-2">Account</div>
            <p className="text-photo-secondary font-medium">{user?.fullName}</p>
            <p className="text-photo-secondary/60 text-sm truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          
          <nav className="flex flex-col gap-4 px-6 py-4 border-t border-photo-border/10">
            <div className="text-sm text-photo-secondary/60 mb-2">Navigation</div>
            <Link
              href="/home"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors",
                pathname === "/home" && "text-photo-secondary font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href="/my-albums"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors",
                pathname === "/my-albums" && "text-photo-secondary font-medium"
              )}
            >
              My Albums
            </Link>
            <Link
              href="/explore"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors",
                pathname === "/explore" && "text-photo-secondary font-medium"
              )}
            >
              Explore
            </Link>
          </nav>
          
          <div className="mt-auto border-t border-photo-border/10">
            <nav className="flex flex-col gap-4 px-6 py-4">
              <div className="text-sm text-photo-secondary/60 mb-2">Settings</div>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-photo-secondary/70 hover:text-photo-secondary transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}