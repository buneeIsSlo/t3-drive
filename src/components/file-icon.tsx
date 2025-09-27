import {
  FileText,
  ImageIcon,
  FileSpreadsheet,
  Presentation,
  File,
  Code,
  Music,
  Video,
  Archive,
} from "lucide-react";

interface FileIconProps {
  extension: string;
  className?: string;
}

export function FileTypeIcon({ extension, className }: FileIconProps) {
  const ext = extension.toLowerCase().replace(".", "");
  console.log(ext);

  const getFileIcon = () => {
    switch (ext) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FileText className={className} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return <ImageIcon className={className} />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className={className} />;
      case "ppt":
      case "pptx":
        return <Presentation className={className} />;
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "html":
      case "css":
      case "sql":
      case "fig":
        return <Code className={className} />;
      case "mp3":
      case "wav":
      case "flac":
        return <Music className={className} />;
      case "mp4":
      case "avi":
      case "mov":
        return <Video className={className} />;
      case "zip":
      case "rar":
      case "7z":
        return <Archive className={className} />;
      default:
        return <File className={className} />;
    }
  };

  return getFileIcon();
}
