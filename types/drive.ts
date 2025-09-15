export interface FileItem {
  id: string;
  name: string;
  type: "file";
  size: string;
  parent: string;
  url: string;
}

export interface FolderItem {
  id: string;
  name: string;
  type: "folder";
  parent: string | null;
}
