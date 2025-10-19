"use client";

import { Search, HardDrive, Sun, Moon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "next-themes";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useGlobalSearch } from "~/context/global-search-context";

export function DriveHeader() {
  const { theme, setTheme } = useTheme();
  const { openSearch } = useGlobalSearch();

  return (
    <header className="border-border bg-background flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Link href="/my-drive" className="flex items-center gap-2">
          <HardDrive className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-xl font-semibold">T3-Drive</h1>
        </Link>
      </div>

      <div className="mx-8 max-w-2xl flex-1">
        <Button
          variant="outline"
          className="bg-muted hover:bg-muted/80 w-full justify-start text-muted-foreground"
          onClick={openSearch}
        >
          <Search className="mr-2 h-4 w-4" />
          Search in Drive
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8"
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="flex">
          <SignedOut>
            <Button asChild variant={"secondary"} className="text-primary">
              <SignInButton />
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
