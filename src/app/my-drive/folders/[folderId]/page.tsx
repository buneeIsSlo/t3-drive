import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { QUERIES } from "~/server/db/queries";
import { cookies } from "next/headers";

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
          parents={parents}
          initialViewMode={initialViewMode}
          folderId={folderId}
        />
      </div>
    </div>
  );
}
