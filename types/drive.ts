export interface FileItem {
  id: string
  name: string
  type: "file"
  modifiedDate: string
  size: string
  url: string
}

export interface FolderItem {
  id: string
  name: string
  type: "folder"
  modifiedDate: string
  size: null
  children?: (FileItem | FolderItem)[]
}
