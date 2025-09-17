import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function MyDriveRootPage() {
  const files = await db
    .select()
    .from(filesSchema)
    .where(eq(filesSchema.parent, 0));
  const folders = await db
    .select()
    .from(foldersSchema)
    .where(eq(foldersSchema.parent, 0));

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
