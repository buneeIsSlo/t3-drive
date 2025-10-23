import { HardDrive, Clock, Star, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { StorageIndicator } from "./storage-indicator";

export function DriveSidebar() {
  const sidebarItems = [
    { icon: HardDrive, label: "My Drive", active: true },
    { icon: Clock, label: "Recent" },
    { icon: Star, label: "Starred" },
    { icon: Trash2, label: "Trash" },
  ];

  return (
    <aside className="border-sidebar-border bg-sidebar w-64 flex-col border-r p-4 hidden md:flex">
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start ${item.active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-primary"
              }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <StorageIndicator variant="desktop" />
      </div>
    </aside>
  );
}
