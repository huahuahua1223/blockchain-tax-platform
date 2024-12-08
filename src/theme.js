import { lightTheme as baseLightTheme, darkTheme as baseDarkTheme } from '@rainbow-me/rainbowkit';

export const lightTheme = {
  ...baseLightTheme,
  colors: {
    ...baseLightTheme.colors,
    accentColor: '#4CAF50', // 你可以定制主题颜色
  },
};

export const darkTheme = {
  ...baseDarkTheme,
  colors: {
    ...baseDarkTheme.colors,
    accentColor: '#4CAF50', // 你可以定制主题颜色
  },
};
