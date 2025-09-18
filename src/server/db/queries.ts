import "server-only";

import { db } from "~/server/db";
import {
  filesTable as filesSchema,
  foldersTable as foldersSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type { FileItem } from "~/components/drive-item";

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

  async getAllFolders(folderId: number) {
    return db
      .select()
      .from(foldersSchema)
      .where(eq(foldersSchema.parent, folderId));
  },

  async getAllFiles(folderId: number) {
    return db
      .select()
      .from(filesSchema)
      .where(eq(filesSchema.parent, folderId));
  },
};

export const MUTATIONS = {
  createFile: async function (input: {
    file: {
      name: string;
      size: number;
      url: string;
    };
    userId: string;
  }) {
    return await db.insert(filesSchema).values({
      ...input.file,
      parent: 0,
    });
  },
};
