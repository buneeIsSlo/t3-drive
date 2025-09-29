import { HardDrive, Users, Clock, Star, Trash2, Cloud } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

export function DriveSidebar() {
  const sidebarItems = [
    { icon: HardDrive, label: "My Drive", active: true },
    { icon: Users, label: "Shared with me" },
    { icon: Clock, label: "Recent" },
    { icon: Star, label: "Starred" },
    { icon: Trash2, label: "Trash" },
  ];

  return (
    <aside className="border-sidebar-border bg-sidebar flex w-64 flex-col border-r p-4">
      <nav className="flex-1 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className={`w-full justify-start ${
              item.active
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
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Cloud className="h-4 w-4" />
            <span>Storage</span>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-muted-foreground text-xs">9.7 GB of 15 GB used</p>
        </div>
      </div>
    </aside>
  );
}
