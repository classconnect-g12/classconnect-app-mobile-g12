export const colors = {
  primary: process.env.EXPO_PUBLIC_PRIMARY_COLOR || '#4683a1',
  secondary: process.env.EXPO_PUBLIC_SECONDARY_COLOR || '#2b9dd6',
  background: process.env.EXPO_PUBLIC_BACKGROUND_COLOR || '#ffffff',
  text: process.env.EXPO_PUBLIC_TEXT_COLOR || '#333',
  error: process.env.EXPO_PUBLIC_ERROR_COLOR || '#ff5252',
  success: process.env.EXPO_PUBLIC_SUCCESS_COLOR || '#28a745',
  border: process.env.EXPO_PUBLIC_BORDER_COLOR || '#ccc',
  shadow: process.env.EXPO_PUBLIC_SHADOW_COLOR || '#000',
  cardBackground: process.env.EXPO_PUBLIC_CARD_BACKGROUND || '#f4f6f8',
  inputBackground: process.env.EXPO_PUBLIC_INPUT_BACKGROUND || '#e0e0e0',
  buttonText: process.env.EXPO_PUBLIC_BUTTON_TEXT_COLOR || '#FFF',
};

export const theme = {
  colors,
}; 