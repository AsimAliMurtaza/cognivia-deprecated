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
  IconButton,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FiArrowLeft, FiMoon, FiBell, FiMail } from "react-icons/fi";

export default function AppSettingsPage() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);

  const bg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const primaryColor = "#6EC3C4";
  const hoverBg = useColorModeValue("#E0F7FA", "gray.700");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setNotificationsEnabled(true);
        setEmailAlertsEnabled(true);
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast({
          title: "Error loading settings",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const saveSettings = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Settings saved successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error saving settings:", err);
      toast({
        title: "Error saving settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Box p={6} bg={bg} w="100%" textAlign="center">
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
        </HStack>

        {/* Appearance Section */}
        <VStack align="stretch" spacing={4} mb={6}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textAlign="left"
            color={textColor}
          >
            Appearance
          </Text>

          {/* Dark Mode Toggle */}
          <HStack justify="space-between">
            <HStack>
              <FiMoon />
              <Text>Dark Mode</Text>
            </HStack>
            <Switch
              size="lg"
              colorScheme="teal"
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
            />
          </HStack>
        </VStack>

        <Divider my={4} borderColor={borderColor} />

        {/* Notifications Section */}
        <VStack align="stretch" spacing={4} mb={6}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textAlign="left"
            color={textColor}
          >
            Notifications
          </Text>

          {/* In-App Notifications */}
          <HStack justify="space-between">
            <HStack>
              <FiBell />
              <Text>In-App Notifications</Text>
            </HStack>
            <Switch
              size="lg"
              colorScheme="teal"
              isChecked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </HStack>

          {/* Email Alerts */}
          <HStack justify="space-between">
            <HStack>
              <FiMail />
              <Text>Email Alerts</Text>
            </HStack>
            <Switch
              size="lg"
              colorScheme="teal"
              isChecked={emailAlertsEnabled}
              onChange={() => setEmailAlertsEnabled(!emailAlertsEnabled)}
            />
          </HStack>
        </VStack>

        <Divider my={4} borderColor={borderColor} />

        {/* Save Button */}
        <Button
          bg={primaryColor}
          color="white"
          w="full"
          mt={4}
          _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
          transition="all 0.2s"
          onClick={saveSettings}
          isLoading={loading}
          loadingText="Saving..."
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
}
