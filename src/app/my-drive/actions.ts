"use server";

import { auth } from "@clerk/nextjs/server";
import { MUTATIONS } from "~/server/db/queries";

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
