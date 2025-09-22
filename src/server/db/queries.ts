import "server-only";

import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { eq, isNull } from "drizzle-orm";

export const QUERIES = {
  async getAlParentsForFolder(folderId: number) {
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
  },

  async getAllFolders(folderId: number | null) {
    return db
      .select()
      .from(foldersSchema)
      .where(
        folderId === null
          ? isNull(foldersSchema.parent)
          : eq(foldersSchema.parent, folderId),
      );
  },

  async getFolderById(folderId: number) {
    const folder = await db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.id, folderId));

    return folder[0];
  },

  async getAllFiles(folderId: number | null) {
    return db
      .select()
      .from(filesSchema)
      .where(
        folderId === null
          ? isNull(filesSchema.parent)
          : eq(filesSchema.parent, folderId),
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
};
