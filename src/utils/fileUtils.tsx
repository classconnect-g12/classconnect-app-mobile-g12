import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@theme/colors";
import React from "react";

export function getFileExtension(name: string = ""): string {
  return name.split(".").pop()?.toLowerCase() || "";
}

export function getFileTypeLabel(file: { mimeType?: string; name?: string }): string {
  if (file.mimeType === "application/pdf") return "PDF";
  if (
    file.mimeType === "application/msword" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) return "Word";
  if (
    file.mimeType === "application/vnd.ms-excel" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) return "Excel";
  if (
    file.mimeType === "application/vnd.ms-powerpoint" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) return "PowerPoint";
  if (file.mimeType === "text/csv") return "CSV";
  if (file.mimeType === "text/plain") return "TXT";
  if (file.mimeType?.startsWith("image/")) return "Image";
  if (file.mimeType?.startsWith("video/")) return "Video";
  if (file.mimeType?.startsWith("audio/")) return "Audio";
  if (file.mimeType?.startsWith("application/")) return "Document";
  if (file.mimeType?.startsWith("text/")) return "Text";
  const ext = getFileExtension(file.name);
  return ext ? ext.toUpperCase() : "File";
}

// Ahora acepta el tamaño como segundo argumento
export function getFileIcon(file: { mimeType?: string; name?: string }, size: number = 54) {
  if (file.mimeType === "application/pdf") {
    return <MaterialCommunityIcons name="file-pdf-box" size={size} color="#e74c3c" style={{ marginBottom: 2 }} />;
  }
  if (
    file.mimeType === "application/msword" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <MaterialCommunityIcons name="file-word-box" size={size} color="#2b579a" style={{ marginBottom: 2 }} />;
  }
  if (
    file.mimeType === "application/vnd.ms-excel" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return <MaterialCommunityIcons name="file-excel-box" size={size} color="#217346" style={{ marginBottom: 2 }} />;
  }
  if (
    file.mimeType === "application/vnd.ms-powerpoint" ||
    file.mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <MaterialCommunityIcons name="file-powerpoint-box" size={size} color="#d24726" style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType === "text/csv") {
    return <MaterialCommunityIcons name="file-delimited" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType === "text/plain") {
    return <MaterialCommunityIcons name="file-document-outline" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType?.startsWith("image/")) {
    return <MaterialCommunityIcons name="file-image" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType?.startsWith("video/")) {
    return <MaterialCommunityIcons name="file-video" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType?.startsWith("audio/")) {
    return <MaterialCommunityIcons name="file-music" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  if (file.mimeType?.startsWith("application/") || file.mimeType?.startsWith("text/")) {
    return <MaterialCommunityIcons name="file-document" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
  }
  return <MaterialCommunityIcons name="file" size={size} color={colors.primary} style={{ marginBottom: 2 }} />;
}

export function getNameWithExtension(
  att: { url: string; mimeType?: string },
  idx: number
): string {
  let name = att.url.split("/").pop() || `Attachment${idx + 1}`;
  if (name && !name.includes(".") && att.mimeType) {
    const ext = (() => {
      if (att.mimeType === "text/csv") return "csv";
      if (att.mimeType === "text/plain") return "txt";
      if (att.mimeType === "application/pdf") return "pdf";
      if (att.mimeType === "application/msword") return "doc";
      if (att.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
      if (att.mimeType === "application/vnd.ms-excel") return "xls";
      if (att.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
      if (att.mimeType === "application/vnd.ms-powerpoint") return "ppt";
      if (att.mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "pptx";
      return "";
    })();
    if (ext) name = `${name}.${ext}`;
  }
  return name;
}