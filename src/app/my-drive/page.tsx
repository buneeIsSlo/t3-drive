import { DriveContent } from "~/app/my-drive/components/drive-content";
import { DriveHeader } from "~/app/my-drive/components/drive-header";
import { DriveSidebar } from "~/app/my-drive/components/drive-sidebar";
import { QUERIES } from "~/server/db/queries";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export default async function MyDriveRootPage() {
  const session = await auth();
  if (!session.userId) return null;

  const [files, folders] = await Promise.all([
    QUERIES.getAllFiles(session.userId, null),
    QUERIES.getAllFolders(session.userId, null),
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
