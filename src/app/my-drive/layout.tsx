import { DriveHeader } from "~/app/my-drive/components/drive-header";
import { DriveSidebar } from "~/app/my-drive/components/drive-sidebar";
import { DriveMobileSidebar } from "~/app/my-drive/components/drive-mobile-sidebar";
import { StorageProvider } from "~/context/storage-context";

export default function MyDriveLayout({ children }: { children: React.ReactNode }) {
  return (
    <StorageProvider>
      <div className="bg-background flex h-screen flex-col">
        <DriveHeader />
        <div className="flex flex-1 overflow-hidden">
          <DriveSidebar />
          <DriveMobileSidebar />
          {children}
        </div>
      </div>
    </StorageProvider>
  );
}