import "server-only";

import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { and, asc, desc, eq, isNull, like, sql } from "drizzle-orm";

export const QUERIES = {
  async getAlParentsForFolder(userId: string, folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;

    while (currentId !== null) {
      const rows = await db
        .select()
        .from(foldersSchema)
        .where(
          and(
            eq(foldersSchema.id, currentId),
            eq(foldersSchema.ownerId, userId),
          ),
        );

      const row = rows[0];
      if (!row) break;

      parents.unshift(row);

      // Stop at real DB root (parent null)
      if (row.parent === null) break;
      currentId = row.parent;
    }

    return parents;
  },

  async getAllFolders(userId: string, folderId: number | null) {
    return db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.ownerId, userId),
          folderId === null
            ? isNull(foldersSchema.parent)
            : eq(foldersSchema.parent, folderId),
        ),
      )
      .orderBy(asc(foldersSchema.createdAt));
  },

  async getFolderById(folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));

    return folder[0];
  },

  async getAllFiles(userId: string, folderId: number | null) {
    return db
      .select()
      .from(filesSchema)
      .where(
        and(
          eq(filesSchema.ownerId, userId),
          folderId === null
            ? isNull(filesSchema.parent)
            : eq(filesSchema.parent, folderId),
        ),
      )
      .orderBy(asc(filesSchema.createdAt));
  },

  async searchFilesAndFolders(userId: string, searchQuery: string) {
    const files = await db
      .select()
      .from(filesSchema)
      .where(
        and(
          eq(filesSchema.ownerId, userId),
          like(filesSchema.name, `%${searchQuery}%`),
        ),
      )
      .orderBy(asc(filesSchema.createdAt));

    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.ownerId, userId),
          like(foldersSchema.name, `%${searchQuery}%`),
        ),
      )
      .orderBy(asc(foldersSchema.createdAt));

    return { files, folders };
  },

  async getRecentItems(userId: string) {
    const files = await db
      .select()
      .from(filesSchema)
      .where(
        and(eq(filesSchema.ownerId, userId), eq(filesSchema.isTrashed, false)),
      )
      .orderBy(desc(filesSchema.createdAt))
      .limit(50);

    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.ownerId, userId),
          eq(foldersSchema.isTrashed, false),
        ),
      )
      .orderBy(desc(foldersSchema.createdAt))
      .limit(50);

    return { files, folders };
  },

  async getStarredItems(userId: string) {
    const files = await db
      .select()
      .from(filesSchema)
      .where(
        and(
          eq(filesSchema.ownerId, userId),
          eq(filesSchema.isStarred, true),
          eq(filesSchema.isTrashed, false),
        ),
      )
      .orderBy(desc(filesSchema.createdAt));

    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.ownerId, userId),
          eq(foldersSchema.isStarred, true),
          eq(foldersSchema.isTrashed, false),
        ),
      )
      .orderBy(desc(foldersSchema.createdAt));

    return { files, folders };
  },

  async getTrashedItems(userId: string) {
    const files = await db
      .select()
      .from(filesSchema)
      .where(
        and(eq(filesSchema.ownerId, userId), eq(filesSchema.isTrashed, true)),
      )
      .orderBy(desc(filesSchema.createdAt));

    const folders = await db
      .select()
      .from(foldersSchema)
      .where(
        and(
          eq(foldersSchema.ownerId, userId),
          eq(foldersSchema.isTrashed, true),
        ),
      )
      .orderBy(desc(foldersSchema.createdAt));

    return { files, folders };
  },

  async getUserStorageUsed(userId: string): Promise<number> {
    try {
      const result = await db
        .select({ totalSize: sql<number>`SUM(${filesSchema.size})` })
        .from(filesSchema)
        .where(eq(filesSchema.ownerId, userId));

      return result[0]?.totalSize ?? 0;
    } catch (error) {
      console.error("Error fetching user storage usage: ", error);
      return 0;
    }
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number | null;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      ownerId: input.userId,
    });
  },
  createFolder: async function (input: {
    name: string;
    parent: number | null;
    userId: string;
  }) {
    return await db.insert(foldersSchema).values({
      name: input.name,
      parent: input.parent,
      ownerId: input.userId,
    });
  },
  renameFile: async function (input: { id: number; name: string }) {
    return await db
      .update(filesSchema)
      .set({ name: input.name })
      .where(eq(filesSchema.id, input.id));
  },
  renameFolder: async function (input: { id: number; name: string }) {
    return await db
      .update(foldersSchema)
      .set({ name: input.name })
      .where(eq(foldersSchema.id, input.id));
  },
  toggleFileStar: async function (input: { id: number; isStarred: boolean }) {
    return await db
      .update(filesSchema)
      .set({ isStarred: input.isStarred })
      .where(eq(filesSchema.id, input.id));
  },
  toggleFolderStar: async function (input: { id: number; isStarred: boolean }) {
    return await db
      .update(foldersSchema)
      .set({ isStarred: input.isStarred })
      .where(eq(foldersSchema.id, input.id));
  },
  toggleFileTrash: async function (input: { id: number; isTrashed: boolean }) {
    return await db
      .update(filesSchema)
      .set({ isTrashed: input.isTrashed, isStarred: false })
      .where(eq(filesSchema.id, input.id));
  },
  toggleFolderTrash: async function (input: {
    id: number;
    isTrashed: boolean;
  }) {
    return await db
      .update(foldersSchema)
      .set({ isTrashed: input.isTrashed, isStarred: false })
      .where(eq(foldersSchema.id, input.id));
  },
};
