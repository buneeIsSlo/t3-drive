"use client";

import { Search, HardDrive, Sun, Moon, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useTheme } from "next-themes";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { useSearch } from "~/context/search-context";

export function DriveHeader() {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState("");
  const { isSearching, noResults, performSearch, clearSearch } = useSearch();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      performSearch(query);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery === "") {
      clearSearch();
    }
  };

  return (
    <header className="border-border bg-background flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <Link href="/my-drive" className="flex items-center gap-2">
          <HardDrive className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-xl font-semibold">T3-Drive</h1>
        </Link>
      </div>

      <div className="mx-8 max-w-2xl flex-1">
        <div className="relative">
          <div className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform">
            {isSearching ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search />
            )}
          </div>
          <Input
            placeholder="Search in Drive"
            className="bg-muted focus-visible:ring-ring border-0 pl-10 focus-visible:ring-1"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleSearch}
          />
          {noResults && query !== "" && (
            <p className="text-muted-foreground absolute top-full mt-1.5 text-xs">
              No results found for "{query}".
            </p>
          )}
        </div>
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
