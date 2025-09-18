import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { QUERIES } from "~/server/db/queries";

export default async function MyDriveFolderPage(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const folderId = parseInt(params.folderId);

  const [files, folders, parents] = await Promise.all([
    QUERIES.getAllFiles(folderId),
    QUERIES.getAllFolders(folderId),
    QUERIES.getAlParentsForFolder(folderId),
  ]);

  return (
    <div className="bg-background flex h-screen flex-col">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar />
        <DriveContent files={files} folders={folders} parents={parents} />
      </div>
    </div>
  );
}
