import { DriveContent } from "~/app/my-drive/components/drive-content";
import { QUERIES } from "~/server/db/queries";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

export default async function MyDriveFolderPage(props: {
  params: Promise<{ folderId: string }>;
}) {
  const params = await props.params;
  const folderId = parseInt(params.folderId);

  const session = await auth();
  if (!session.userId) return null;

  const [files, folders, parents] = await Promise.all([
    QUERIES.getAllFiles(session.userId, folderId),
    QUERIES.getAllFolders(session.userId, folderId),
    QUERIES.getAlParentsForFolder(session.userId, folderId),
  ]);
  const cookieStore = await cookies();
  const initialViewMode =
    cookieStore.get("viewMode")?.value === "list" ? "list" : "grid";

  return (
    <DriveContent
      files={files}
      folders={folders}
      parents={parents}
      initialViewMode={initialViewMode}
      folderId={folderId}
    />
  );
}
