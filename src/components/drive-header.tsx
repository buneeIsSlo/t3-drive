"use client";

import { Search, HardDrive, Sun, Moon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useTheme } from "next-themes";

export function DriveHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-border bg-background flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <HardDrive className="text-primary h-8 w-8" />
          <h1 className="text-foreground text-xl font-semibold">T3-Drive</h1>
        </div>
      </div>

      <div className="mx-8 max-w-2xl flex-1">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search in Drive"
            className="bg-muted focus-visible:ring-ring border-0 pl-10 focus-visible:ring-1"
          />
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

        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
          <span className="text-primary-foreground text-sm font-medium">U</span>
        </div>
      </div>
    </header>
  );
}
