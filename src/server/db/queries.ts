import "server-only";

import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { and, eq, isNull } from "drizzle-orm";

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
      );
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
      );
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
};
