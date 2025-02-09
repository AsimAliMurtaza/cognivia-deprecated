import { extendTheme, ThemeConfig } from "@chakra-ui/react";

// Theme Config for Dark Mode
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
});

export default theme;
