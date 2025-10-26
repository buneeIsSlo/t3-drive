import { auth } from "@clerk/nextjs/server";
import { DriveContent } from "~/app/my-drive/components/drive-content";
import { QUERIES } from "~/server/db/queries";

export default async function StarredPage() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { files, folders } = await QUERIES.getStarredItems(userId);

  return (
    <DriveContent
      files={files}
      folders={folders}
      title="Starred"
      showUploadButton={false}
      showCreateFolderButton={false}
    />
  );
}
