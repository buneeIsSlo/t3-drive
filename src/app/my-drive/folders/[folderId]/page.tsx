import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

type FolderPageProps = {
  folderId: string;
};

const getAllParents = async (folderId: number) => {
  const parents = [];
  let currentId: number | null = folderId;

  while (currentId !== null) {
    const rows = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, currentId));

    const row = rows[0];
    if (!row) break;

    parents.unshift(row);

    // Stop at real DB root (parent null)
    if (row.parent === null) break;
    currentId = row.parent;
  }

  return parents;
};

export default async function MyDriveFolderPage(props: {
  params: Promise<FolderPageProps>;
}) {
  const params = await props.params;
  const folderId = parseInt(params.folderId);

  const filesPromise = db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, folderId));

  const foldersPromise = db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, folderId));

  const parentsPromise = getAllParents(folderId);

  const [files, folders, parents] = await Promise.all([
    filesPromise,
    foldersPromise,
    parentsPromise,
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
