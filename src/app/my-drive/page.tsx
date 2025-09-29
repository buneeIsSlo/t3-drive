import { DriveContent } from "~/app/my-drive/components/drive-content";
import { DriveHeader } from "~/app/my-drive/components/drive-header";
import { DriveSidebar } from "~/app/my-drive/components/drive-sidebar";
import { QUERIES } from "~/server/db/queries";
import { cookies } from "next/headers";

export default async function MyDriveRootPage() {
  const [files, folders] = await Promise.all([
    QUERIES.getAllFiles(null),
    QUERIES.getAllFolders(null),
  ]);
  const cookieStore = await cookies();
  const initialViewMode =
    cookieStore.get("viewMode")?.value === "list" ? "list" : "grid";

  return (
    <div className="bg-background flex h-screen flex-col">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar />
        <DriveContent
          files={files}
          folders={folders}
          parents={[]}
          initialViewMode={initialViewMode}
          folderId={null}
        />
      </div>
    </div>
  );
}
