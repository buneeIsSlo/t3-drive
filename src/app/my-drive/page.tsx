import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { QUERIES } from "~/server/db/queries";

export default async function MyDriveRootPage() {
  const [files, folders] = await Promise.all([
    QUERIES.getAllFiles(0),
    QUERIES.getAllFolders(0),
  ]);

  return (
    <div className="bg-background flex h-screen flex-col">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar />
        <DriveContent files={files} folders={folders} parents={[]} />
      </div>
    </div>
  );
}
