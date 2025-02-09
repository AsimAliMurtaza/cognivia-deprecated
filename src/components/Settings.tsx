"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Switch,
  Text,
  Divider,
  useColorMode,
  useColorModeValue,
  HStack,
  Select,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import { FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [language, setLanguage] = useState("English");
  const [subscription, setSubscription] = useState("Basic");

  // Soft pastel colors
  const bg = useColorModeValue("#F3E5F5", "gray.800"); // Soft purple for light mode
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const primaryColor = "#6EC3C4"; // Soft teal
  const hoverBg = useColorModeValue("#E0F7FA", "gray.700"); // Light teal for hover

  return (
    <Container maxW="container.2xl" py={10}>
      <Box
        p={6}
        borderRadius="2xl"
        boxShadow="2xl"
        bg={bg}
        w="100%"
        textAlign="center"
      >
        {/* Header */}
        <HStack w="full" justify="space-between" mb={4}>
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            onClick={() => router.back()}
            variant="ghost"
            color={textColor}
            _hover={{ bg: hoverBg }}
          />
          <IconButton
            aria-label="Toggle Theme"
            icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            color={textColor}
            _hover={{ bg: hoverBg }}
          />
        </HStack>

        {/* Dark Mode Toggle */}
        <Box textAlign="left" w="full">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Dark Mode
            </Text>
            <Switch
              size="lg"
              colorScheme="teal"
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
            />
          </HStack>
        </Box>

        <Divider my={4} borderColor={borderColor} />

        {/* Subscription Plan */}
        <Box textAlign="left" w="full">
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Subscription Plan
          </Text>
          <HStack justify="space-between" mt={2}>
            <Badge
              colorScheme={subscription === "Pro" ? "green" : "blue"}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              {subscription} Plan
            </Badge>
            <Button
              size="sm"
              bg={primaryColor}
              color="white"
              _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
              onClick={() => setSubscription("Pro")}
              transition="all 0.2s"
            >
              Upgrade to Pro
            </Button>
          </HStack>
        </Box>

        <Divider my={4} borderColor={borderColor} />

        {/* General Settings */}
        <Box textAlign="left" w="full">
          <Text fontSize="lg" fontWeight="medium" color={textColor}>
            Language
          </Text>
          <Select
            mt={2}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            bg={useColorModeValue("white", "gray.700")}
            borderColor={borderColor}
            _hover={{ borderColor: primaryColor }}
            _focus={{
              borderColor: primaryColor,
              boxShadow: `0 0 0 1px ${primaryColor}`,
            }}
          >
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
          </Select>
        </Box>

        <Divider my={4} borderColor={borderColor} />

        {/* Save Changes Button */}
        <Button
          bg={primaryColor}
          color="white"
          w="full"
          mt={4}
          _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
          transition="all 0.2s"
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
}
