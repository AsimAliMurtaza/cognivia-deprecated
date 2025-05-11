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
  Select,
  FormControl,
  FormLabel,
  useToken,
} from "@chakra-ui/react";
import { FiArrowLeft, FiMoon, FiBell, FiMail, FiGlobe } from "react-icons/fi";

export default function AppSettingsPage() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [language, setLanguage] = useState("en");

  // Get Material You colors from theme
  const [primary, primaryDark] = useToken("colors", ["teal.400", "blue.500"]);
  const [onSurface, onSurfaceDark] = useToken("colors", ["gray.900", "white"]);
  const [surfaceVariant, surfaceVariantDark] = useToken("colors", [
    "gray.100",
    "gray.700",
  ]);

  // Dynamic colors based on theme
  const textColor = useColorModeValue(onSurface, onSurfaceDark);
  const cardBg = useColorModeValue(surfaceVariant, surfaceVariantDark);
  const primaryColor = useColorModeValue(primary, primaryDark);
  const hoverBg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setNotificationsEnabled(true);
        setEmailAlertsEnabled(true);
        // Set language from localStorage or default
        setLanguage(localStorage.getItem("language") || "en");
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

      // Save language preference
      localStorage.setItem("language", language);
      
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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <Container maxW="100vw" py={6}>
      <Box
        p={6}
        borderRadius="xl"
      >
        {/* Header */}
        <HStack w="full" justify="space-between" mb={8}>
          <IconButton
            aria-label="Back"
            icon={<FiArrowLeft />}
            onClick={() => router.back()}
            variant="ghost"
            color={textColor}
            borderRadius="full"
            _hover={{ bg: hoverBg }}
          />
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Settings
          </Text>
          <Box w={10} /> {/* Spacer for alignment */}
        </HStack>

        {/* Language Section */}
        <VStack align="stretch" spacing={4} mb={6}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            textAlign="left"
            color={textColor}
            opacity={0.8}
          >
            Language & Region
          </Text>
          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="transparent"
            _hover={{ borderColor: useColorModeValue("gray.200", "gray.600") }}
          >
            <FormControl>
              <HStack justify="space-between">
                <HStack>
                  <FiGlobe />
                  <FormLabel mb={0}>Language</FormLabel>
                </HStack>
                <Select
                  value={language}
                  onChange={handleLanguageChange}
                  variant="filled"
                  size="sm"
                  width="150px"
                  bg={useColorModeValue("white", "gray.700")}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </Select>
              </HStack>
            </FormControl>
          </Box>
        </VStack>

        <Divider my={4} borderColor={useColorModeValue("gray.200", "gray.600")} />

        {/* Appearance Section */}
        <VStack align="stretch" spacing={4} mb={6}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            textAlign="left"
            color={textColor}
            opacity={0.8}
          >
            Appearance
          </Text>
          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="transparent"
            _hover={{ borderColor: useColorModeValue("gray.200", "gray.600") }}
          >
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
          </Box>
        </VStack>

        <Divider my={4} borderColor={useColorModeValue("gray.200", "gray.600")} />

        {/* Notifications Section */}
        <VStack align="stretch" spacing={4} mb={6}>
          <Text
            fontSize="md"
            fontWeight="semibold"
            textAlign="left"
            color={textColor}
            opacity={0.8}
          >
            Notifications
          </Text>
          <Box
            p={4}
            bg={cardBg}
            borderRadius="lg"
            borderWidth="1px"
            borderColor="transparent"
            _hover={{ borderColor: useColorModeValue("gray.200", "gray.600") }}
          >
            <VStack align="stretch" spacing={4}>
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
          </Box>
        </VStack>

        {/* Save Button */}
        <Button
          bg={primaryColor}
          color="white"
          w="full"
          mt={8}
          size="lg"
          borderRadius="full"
          _hover={{ 
            bg: useColorModeValue("teal.500", "teal.400"),
            transform: "translateY(-2px)",
            boxShadow: "md"
          }}
          _active={{
            transform: "translateY(0)",
            boxShadow: "none"
          }}
          transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
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