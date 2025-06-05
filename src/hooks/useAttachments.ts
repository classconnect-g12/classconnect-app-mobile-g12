import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";

export interface AttachmentFile {
  uri: string;
  mimeType?: string;
  name?: string;
  isExisting?: boolean;
}

export function useAttachments(initialAttachments: AttachmentFile[] = []) {
  const [attachments, setAttachments] = useState<AttachmentFile[]>(initialAttachments);
  const [modalImageUri, setModalImageUri] = useState<string | null>(null);

  const handlePickAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
    });
    if (!result.canceled && result.assets) {
      setAttachments((prev) => [
        ...prev,
        ...result.assets.map((file: any) => ({
          ...file,
          isExisting: false,
        })),
      ]);
    }
  };

  const handleRemoveAttachment = (uri: string) => {
    setAttachments((prev) => prev.filter((a) => a.uri !== uri));
  };

  const handlePreviewAttachment = (uri: string) => {
    setModalImageUri(uri);
  };

  return {
    attachments,
    setAttachments,
    handlePickAttachment,
    handleRemoveAttachment,
    handlePreviewAttachment,
    modalImageUri,
    setModalImageUri,
  };
}