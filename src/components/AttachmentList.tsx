import React from "react";
import { View, Image, TouchableOpacity, Modal, Pressable } from "react-native";
import { Chip } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import * as WebBrowser from "expo-web-browser";
import { getFileTypeLabel, getFileIcon } from "@utils/fileUtils";

interface AttachmentFile {
  uri: string;
  mimeType?: string;
  name?: string;
  isExisting?: boolean;
}

interface AttachmentListProps {
  attachments: AttachmentFile[];
  onRemove: (uri: string) => void;
  onPreview: (uri: string) => void;
  modalImageUri: string | null;
  setModalImageUri: (uri: string | null) => void;
  iconSize?: number; // <-- Agregado para tamaño de íconos
}

export const AttachmentList: React.FC<AttachmentListProps> = ({
  attachments,
  onRemove,
  onPreview,
  modalImageUri,
  setModalImageUri,
  iconSize = 80, // Valor por defecto
}) => (
  <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 18 }}>
    {attachments.map((file) => {
      // Imagen
      if (file.mimeType && file.mimeType.startsWith("image/")) {
        return (
          <View key={file.uri} style={{ marginRight: 10, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => onPreview(file.uri)}>
              <Image
                source={{ uri: file.uri }}
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: 12,
                  backgroundColor: "#eee",
                  borderWidth: 1,
                  borderColor: "#d0d7e2",
                  marginBottom: 4,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Chip
              onClose={() => onRemove(file.uri)}
              textStyle={{ fontSize: 13 }}
              style={{ maxWidth: iconSize }}
            >
              {getFileTypeLabel(file)}
            </Chip>
          </View>
        );
      }
      // Video
      if (file.mimeType && file.mimeType.startsWith("video/")) {
        return (
          <View key={file.uri} style={{ marginRight: 10, marginBottom: 10 }}>
            <TouchableOpacity onPress={() => onPreview(file.uri)}>
              <Video
                source={{ uri: file.uri }}
                style={{
                  width: iconSize,
                  height: iconSize,
                  borderRadius: 12,
                  backgroundColor: "#000",
                  marginBottom: 4,
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            </TouchableOpacity>
            <Chip
              onClose={() => onRemove(file.uri)}
              textStyle={{ fontSize: 13 }}
              style={{ maxWidth: iconSize }}
            >
              {getFileTypeLabel(file)}
            </Chip>
          </View>
        );
      }
      // Documentos y otros archivos
      return (
        <TouchableOpacity
          key={file.uri}
          style={{
            marginRight: 10,
            marginBottom: 10,
            alignItems: "center",
            maxWidth: iconSize,
          }}
          onPress={() => WebBrowser.openBrowserAsync(file.uri)}
        >
          {getFileIcon(file, iconSize)}
          <Chip
            onClose={() => onRemove(file.uri)}
            textStyle={{ fontSize: 13 }}
            style={{ maxWidth: iconSize }}
          >
            {getFileTypeLabel(file)}
          </Chip>
        </TouchableOpacity>
      );
    })}
    <Modal
      visible={!!modalImageUri}
      transparent
      animationType="fade"
      onRequestClose={() => setModalImageUri(null)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.85)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setModalImageUri(null)}
      >
        <View
          style={{
            width: "92%",
            height: "75%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {modalImageUri && (
            <Image
              source={{ uri: modalImageUri }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 14,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Pressable>
    </Modal>
  </View>
);