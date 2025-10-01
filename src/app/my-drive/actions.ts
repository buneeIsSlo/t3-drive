"use server";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "~/server/db";
import { MUTATIONS } from "~/server/db/queries";
import { filesTable } from "~/server/db/schema";

const utApi = new UTApi();

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
