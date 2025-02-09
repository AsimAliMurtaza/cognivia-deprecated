"use client";

import { useColorMode, IconButton } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      aria-label="Toggle Dark Mode"
      icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
      onClick={toggleColorMode}
      variant="ghost"
    />
  );
}
