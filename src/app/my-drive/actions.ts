"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";
import { MUTATIONS, QUERIES } from "~/server/db/queries";
import { filesTable, foldersTable } from "~/server/db/schema";

const utApi = new UTApi();

export async function searchAction(query: string) {
  const user = await auth();
  if (!user.userId) {
    return { success: false, error: "User not found" };
  }

  if (!query) {
    return { success: true, data: { files: [], folders: [] } };
  }

  const results = await QUERIES.searchFilesAndFolders(user.userId, query);

  return { success: true, data: results };
}

export async function createNewFolder(
  name: string,
  parentFolderId: number | null,
) {
  try {
    const user = await auth();
    if (!user.userId) {
      return { success: false, error: "User not found" };
    }

    if (name.length > 64) {
      return {
        success: false,
        error: "Folder name is too long (max 64 characters)",
      };
    }

    await MUTATIONS.createFolder({
      name,
      parent: parentFolderId,
      userId: user.userId,
    });

    return { success: true };
  } catch (error) {
    const errMsg =
      error instanceof Error && error.message
        ? error.message
        : "Failed to create folder";
    return { success: false, error: errMsg ?? "Failed to create folder" };
  }
}

export async function deleteFile(fileId: number) {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found");
  }

  const [file] = await db
    .select()
    .from(filesTable)
    .where(and(eq(filesTable.id, fileId), eq(filesTable.ownerId, user.userId)));

  if (!file) {
    throw new Error("File not found");
  }

  const fileKey = file.url.split("/f/")[1];
  if (!fileKey) {
    throw new Error("Invalid file url");
  }

  await utApi.deleteFiles([fileKey]);

  await db.delete(filesTable).where(eq(filesTable.id, fileId));

  const forceRefreshCookie = await cookies();
  forceRefreshCookie.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true } as const;
}

export async function deleteFolder(folderId: number) {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found");
  }

  try {
    const [folder] = await db
      .select()
      .from(foldersTable)
      .where(
        and(
          eq(foldersTable.id, folderId),
          eq(foldersTable.ownerId, user.userId),
        ),
      );

    if (!folder) {
      throw new Error("Folder not found");
    }

    const allFolderIds = new Set<number>([folderId]);
    const queue: number[] = [folderId];

    const BATCH_SIZE = 100;

    while (queue.length > 0) {
      const batch = queue.splice(0, BATCH_SIZE);

      const children = await db
        .select()
        .from(foldersTable)
        .where(
          and(
            eq(foldersTable.ownerId, user.userId),
            inArray(foldersTable.parent, batch),
          ),
        );

      for (const child of children) {
        if (!allFolderIds.has(child.id)) {
          allFolderIds.add(child.id);
          queue.push(child.id);
        }
      }
    }

    const folderIds = Array.from(allFolderIds);

    // Fetch all files in these folders
    const files = folderIds.length
      ? await db
          .select()
          .from(filesTable)
          .where(
            and(
              eq(filesTable.ownerId, user.userId),
              inArray(filesTable.parent, folderIds),
            ),
          )
      : [];

    const fileIdsToDelete: number[] = [];
    const fileKeysToDelete: string[] = [];

    for (const f of files) {
      fileIdsToDelete.push(f.id);
      const key = f.url.split("/f/")[1];
      if (key) {
        fileKeysToDelete.push(key);
      } else {
        console.warn(`Invalid file URL format for file ${f.id}: ${f.url}`);
      }
    }

    await db.transaction(async (tx) => {
      if (fileIdsToDelete.length > 0) {
        await tx
          .delete(filesTable)
          .where(inArray(filesTable.id, fileIdsToDelete));
      }
      if (folderIds.length > 0) {
        await tx
          .delete(foldersTable)
          .where(inArray(foldersTable.id, folderIds));
      }
    });

    // Delete from storage after successful DB deletion
    if (fileKeysToDelete.length > 0) {
      try {
        await utApi.deleteFiles(fileKeysToDelete);
      } catch (storageError) {
        // Log the error but don't fail the operation
        console.error("Failed to delete files from storage:", storageError);
      }
    }

    const forceRefreshCookie = await cookies();
    forceRefreshCookie.set("force-refresh", JSON.stringify(Math.random()));

    return { success: true } as const;
  } catch (error) {
    console.error("Error deleting folder:", error);
    throw error;
  }
}

export async function renameItem(input: {
  id: number;
  type: "file" | "folder";
  name: string;
}) {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found");
  }

  if (input.name.length > 64) {
    throw new Error("Name is too long (max 64 characters)");
  }

  if (input.type === "file") {
    await MUTATIONS.renameFile({ id: input.id, name: input.name });
  } else {
    await MUTATIONS.renameFolder({ id: input.id, name: input.name });
  }

  const forceRefreshCookie = await cookies();
  forceRefreshCookie.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true } as const;
}

export async function starItem(input: {
  id: number;
  type: "file" | "folder";
  isStarred: boolean;
}) {
  const user = await auth();

  if (!user.userId) {
    throw new Error("User not found");
  }

  if (input.type === "file") {
    await MUTATIONS.toggleFileStar({
      id: input.id,
      isStarred: input.isStarred,
    });
  } else {
    await MUTATIONS.toggleFolderStar({
      id: input.id,
      isStarred: input.isStarred,
    });
  }

  const forceRefreshCookie = await cookies();
  forceRefreshCookie.set("force-refresh", JSON.stringify(Math.random()));

  return { success: true } as const;
}
