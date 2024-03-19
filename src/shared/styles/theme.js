import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#198CFF", // Azul primário
    primaryVariant: "#005ecb", // Variação mais escura do azul primário
    secondary: "#03dac4", // Verde-água secundário
    secondaryVariant: "#018786", // Variação mais escura do verde-água secundário
    background: "#ffffff", // Branco para o fundo
    surface: "#f5f5f5", // Cinza claro para superfícies
    accent: "#03dac4", // Verde-água para acentos
    error: "#f44336", // Vermelho para erros
    text: "#000000", // Preto para texto
    onPrimary: "#ffffff", // Branco para texto sobre o azul primário
    onSecondary: "#000000", // Preto para texto sobre o verde-água secundário
    onSurface: "#000000", // Preto para texto sobre superfícies cinza claro
    onError: "#ffffff", // Branco para texto sobre vermelho de erros
    disabled: "#BDBDBD", // Cinza para elementos desabilitados
    placeholder: "#000000", // Preto para placeholders
    backdrop: "#000000", // Preto para fundos de elementos em destaque
    notification: "#f50057", // Rosa para notificações
    confirm: "#4caf50", // Verde para confirmações
    warning: "#ff9800", // Laranja para avisos
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "400",
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "500",
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "300",
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: "100",
    },
  },
};
