"use client";
import { HardDrive, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StorageIndicator } from "./storage-indicator";

export function DriveMobileSidebar() {

  const sidebarItems = [
    { icon: HardDrive, label: "My Drive", active: true },
    { icon: Clock, label: "Recent" },
    { icon: Star, label: "Starred" },
    { icon: Trash2, label: "Trash" },
  ];

  return (
    <aside className="border-sidebar-border bg-sidebar flex w-16 flex-col items-center border-r p-2 md:hidden">
      <nav className="flex-1 space-y-3 flex flex-col">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            size="icon"
            className={item.active ? "bg-sidebar-accent text-sidebar-accent-foreground self-center" : "text-sidebar-foreground hover:bg-sidebar-primary"}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" />
          </Button>
        ))}
      </nav>

      <div className="mt-auto w-full px-1 pb-1">
        <StorageIndicator variant="mobile" />
      </div>
    </aside>
  );
}


