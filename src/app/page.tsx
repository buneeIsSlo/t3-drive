import { DriveContent } from "~/components/drive-content";
import { DriveHeader } from "~/components/drive-header";
import { DriveSidebar } from "~/components/drive-sidebar";
import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";

export default async function T3Drive() {
  const files = await db.select().from(filesSchema);
  const folders = await db.select().from(foldersSchema);

  return (
    <div className="bg-background flex h-screen flex-col">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveSidebar />
        <DriveContent initialFiles={files} initialFolders={folders} />
      </div>
    </div>
  );
}
