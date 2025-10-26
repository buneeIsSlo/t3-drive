import {
  boolean,
  int,
  bigint,
  index,
  text,
  singlestoreTableCreator,
  timestamp,
} from "drizzle-orm/singlestore-core";

export const createTable = singlestoreTableCreator(
  (name) => `t3_drive_${name}`,
);

export const filesTable = createTable(
  "files_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    size: int("size").notNull(),
    url: text("url").notNull(),
    isStarred: boolean("is_starred").notNull().default(false),
    isTrashed: boolean("is_trashed").notNull().default(false),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);

export const foldersTable = createTable(
  "folders_table",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    ownerId: text("owner_id").notNull(),
    name: text("name").notNull(),
    isStarred: boolean("is_starred").notNull().default(false),
    isTrashed: boolean("is_trashed").notNull().default(false),
    parent: bigint("parent", { mode: "number", unsigned: true }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => {
    return [
      index("parent_index").on(t.parent),
      index("owner_id_index").on(t.ownerId),
    ];
  },
);
