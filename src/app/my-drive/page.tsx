import { DriveContent } from "~/app/my-drive/components/drive-content";
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
    <DriveContent
      files={files}
      folders={folders}
      parents={[]}
      initialViewMode={initialViewMode}
      folderId={null}
    />
  );
}
