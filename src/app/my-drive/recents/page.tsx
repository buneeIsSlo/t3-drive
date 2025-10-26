import { auth } from "@clerk/nextjs/server";
import { DriveContent } from "~/app/my-drive/components/drive-content";
import { QUERIES } from "~/server/db/queries";

export default async function RecentsPage() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { files, folders } = await QUERIES.getRecentItems(userId);

  return (
    <DriveContent
      files={files}
      folders={folders}
      title="Recents"
      showUploadButton={false}
      showCreateFolderButton={false}
    />
  );
}
