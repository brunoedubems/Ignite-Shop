import { createStitches } from '@stitches/react';

export const {
  config,
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      white: "#fff",

      "gray-100": "#E1E1E6",
      "gray-300": "#C4C4CC",

      "gray-800": "#202024",
      "gray-900": "#121214",

      "green-300": "#00B37E",
      "green-500": "#00875F",
      blue: "#4568DC",

    },
  },
});
