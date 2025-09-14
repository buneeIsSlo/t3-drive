import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  File,
  Folder,
  Code,
  Music,
  Video,
  Archive,
} from "lucide-react"

interface FileIconProps {
  type: "file" | "folder"
  name: string
  size?: number
}

export function FileIcon({ type, name, size = 24 }: FileIconProps) {
  if (type === "folder") {
    return <Folder className={`h-${size / 4} w-${size / 4} text-accent`} style={{ width: size, height: size }} />
  }

  const extension = name.split(".").pop()?.toLowerCase()

  const getFileIcon = () => {
    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="text-blue-500" style={{ width: size, height: size }} />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <ImageIcon className="text-green-500" style={{ width: size, height: size }} />
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className="text-emerald-500" style={{ width: size, height: size }} />
      case "ppt":
      case "pptx":
        return <Presentation className="text-orange-500" style={{ width: size, height: size }} />
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "html":
      case "css":
      case "sql":
      case "fig":
        return <Code className="text-purple-500" style={{ width: size, height: size }} />
      case "mp3":
      case "wav":
      case "flac":
        return <Music className="text-pink-500" style={{ width: size, height: size }} />
      case "mp4":
      case "avi":
      case "mov":
        return <Video className="text-red-500" style={{ width: size, height: size }} />
      case "zip":
      case "rar":
      case "7z":
        return <Archive className="text-yellow-500" style={{ width: size, height: size }} />
      default:
        return <File className="text-muted-foreground" style={{ width: size, height: size }} />
    }
  }

  return getFileIcon()
}
