"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "@/styles/theme"; // Import theme

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          {children}
      </ChakraProvider>
    </SessionProvider>
  );
}
