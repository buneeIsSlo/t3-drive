import { auth } from "@clerk/nextjs/server";
import { DriveContent } from "~/app/my-drive/components/drive-content";
import { QUERIES } from "~/server/db/queries";

export default async function TrashPage() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const { files, folders } = await QUERIES.getTrashedItems(userId);

  return (
    <DriveContent
      files={files}
      folders={folders}
      title="Trash"
      showUploadButton={false}
      showCreateFolderButton={false}
    />
  );
}
