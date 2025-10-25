"use client";
import { HardDrive, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StorageIndicator } from "./storage-indicator";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DriveMobileSidebar() {
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
    <aside className="border-sidebar-border bg-sidebar flex w-16 flex-col items-center border-r p-2 md:hidden">
      <nav className="flex flex-1 flex-col space-y-3">
        {sidebarItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <Button
              variant={item.active ? "secondary" : "ghost"}
              size="icon"
              className={
                item.active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground self-center"
                  : "text-sidebar-foreground hover:bg-sidebar-primary"
              }
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto w-full px-1 pb-1">
        <StorageIndicator variant="mobile" />
      </div>
    </aside>
  );
}
