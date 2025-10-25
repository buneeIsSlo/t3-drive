"use client";

import { HardDrive, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StorageIndicator } from "./storage-indicator";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DriveSidebar() {
  const pathname = usePathname();
  const sidebarItems = [
    {
      icon: HardDrive,
      label: "My Drive",
      href: "/my-drive",
      active:
        pathname === "/my-drive" ||
        pathname.startsWith("/my-drive/folders") ||
        pathname.startsWith("/my-drive/files"),
    },
    {
      icon: Clock,
      label: "Recent",
      href: "/my-drive/recents",
      active: pathname === "/my-drive/recents",
    },
    {
      icon: Star,
      label: "Starred",
      href: "/my-drive/starred",
      active: pathname === "/my-drive/starred",
    },
    {
      icon: Trash2,
      label: "Trash",
      href: "/my-drive/trash",
      active: pathname === "/my-drive/trash",
    },
  ];

  return (
    <aside className="border-sidebar-border bg-sidebar hidden w-64 flex-col border-r p-4 md:flex">
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <Button
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full cursor-pointer justify-start ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-primary"
              }`}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <StorageIndicator variant="desktop" />
      </div>
    </aside>
  );
}
