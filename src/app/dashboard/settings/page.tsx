"use client";

import { useState, useEffect } from "react";
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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";

export default function SettingsPage() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [language, setLanguage] = useState("English");
  const [subscription, setSubscription] = useState("Basic");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const primaryColor = "#6EC3C4";
  const hoverBg = useColorModeValue("#E0F7FA", "gray.700");

  // Fetch current 2FA setting
  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const res = await fetch("/api/settings/2fa");
        const data = await res.json();
        setIs2FAEnabled(data.is2FAEnabled);
      } catch (err) {
        toast({
          title: "Error loading 2FA setting",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch2FAStatus();
  }, [toast]);

  const toggle2FA = async () => {
    try {
      setToggling(true);
      const res = await fetch("/api/settings/2fa", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is2FAEnabled: !is2FAEnabled }),
      });

      if (!res.ok) throw new Error("Failed to update 2FA setting");

      setIs2FAEnabled(!is2FAEnabled);
      toast({
        title: `2FA ${!is2FAEnabled ? "enabled" : "disabled"} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error updating 2FA setting",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setToggling(false);
    }
  };

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

        {/* 2FA Toggle */}
        <Box textAlign="left" w="full">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="medium" color={textColor}>
              Two-Factor Authentication (2FA)
            </Text>
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <Switch
                size="lg"
                colorScheme="teal"
                isChecked={is2FAEnabled}
                onChange={toggle2FA}
                isDisabled={toggling}
              />
            )}
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

        {/* Language */}
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
