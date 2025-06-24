import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Chip } from "react-native-paper";
import { getFileTypeLabel, getFileIcon } from "@utils/fileUtils";

type Props = {
  file: any;
  idx: number;
  files: any[];
  onRemove?: (uri: string) => void;
  openImageViewer?: (images: string[], index: number) => void;
  size?: { width: number; height: number };
};

export const AttachmentPreview: React.FC<Props> = ({
  file,
  idx,
  files,
  onRemove,
  openImageViewer,
  size = { width: 80, height: 80 },
}) => {
  if (file.mimeType && file.mimeType.startsWith("image/")) {
    const images = files.filter(f => f.mimeType && f.mimeType.startsWith("image/"));
    return (
      <TouchableOpacity
        key={file.uri}
        onPress={() =>
          openImageViewer && openImageViewer(images.map(f => f.uri), images.findIndex(f => f.uri === file.uri))
        }
        style={{
          marginRight: 10,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#d0d7e2",
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: file.uri }}
          style={{
            width: size.width,
            height: size.height,
            borderRadius: 8,
            backgroundColor: "#eee",
          }}
          resizeMode="cover"
        />
        <Chip
          style={{ maxWidth: size.width, marginTop: 2 }}
          onClose={onRemove ? () => onRemove(file.uri) : undefined}
        >
          {getFileTypeLabel(file)}
        </Chip>
      </TouchableOpacity>
    );
  }
  if (file.mimeType && file.mimeType.startsWith("video/")) {
    return (
      <View key={file.uri} style={{ marginRight: 10, alignItems: "center" }}>
        <Video
          source={{ uri: file.uri }}
          style={{
            width: size.width,
            height: size.height,
            borderRadius: 8,
            backgroundColor: "#000",
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />
        <Chip
          style={{ maxWidth: size.width, marginTop: 2 }}
          onClose={onRemove ? () => onRemove(file.uri) : undefined}
        >
          {getFileTypeLabel(file)}
        </Chip>
      </View>
    );
  }
  // Otros archivos
  return (
    <TouchableOpacity
      key={file.uri}
      style={{ marginRight: 10, alignItems: "center", maxWidth: size.width + 10 }}
      onPress={() => file.uri && openImageViewer && openImageViewer([file.uri], 0)}
    >
      {getFileIcon(file)}
      <Chip
        style={{ maxWidth: size.width + 10, marginTop: 2 }}
        textStyle={{ fontSize: 13 }}
        onClose={onRemove ? () => onRemove(file.uri) : undefined}
      >
        {getFileTypeLabel(file)}
      </Chip>
    </TouchableOpacity>
  );
};