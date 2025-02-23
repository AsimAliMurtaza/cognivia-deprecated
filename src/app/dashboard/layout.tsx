"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  IconButton,
  Tooltip,
  useColorModeValue,
  Button,
  useBreakpointValue,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  FiHome,
  FiBook,
  FiBarChart,
  FiSettings,
  FiEdit,
  FiMessageSquare,
  FiChevronLeft,
  FiMenu,
} from "react-icons/fi";
import ProfileDialog from "@/components/ProfileDialog";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

// Framer Motion Wrapper
const MotionBox = motion(Box);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Removed `isOpen` since it's unused

  // Light & Dark Mode Colors
  const sidebarBg = useColorModeValue("gray.100", "gray.900");
  const sidebarHoverBg = useColorModeValue("teal.500", "teal.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Responsive Behavior
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { data: session, status } = useSession();

  const modules = [
    { name: "Overview", icon: FiHome, path: "/dashboard" },
    { name: "Quizzes", icon: FiBook, path: "/dashboard/quizzes" },
    {
      name: "Cognivia AI",
      icon: FiMessageSquare,
      path: "/dashboard/ai-assistant",
    },
    {
      name: "Performance Report",
      icon: FiBarChart,
      path: "/dashboard/performance",
    },
    { name: "Smart Notes", icon: FiEdit, path: "/dashboard/notes" },
    { name: "Settings", icon: FiSettings, path: "/dashboard/settings" },
  ];

  if (status === "loading")
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  if (!session) {
    router.push("/login");
    return null;
  }

  const toggleSidebar = () => {
    console.log(isOpen);
    setSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      if (!isSidebarOpen) onOpen();
      else onClose();
    }
  };

  return (
    <Flex maxH="100vh">
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <MotionBox
            as="aside"
            w={{ base: "250px", md: isSidebarOpen ? "250px" : "80px" }}
            initial={{ width: isSidebarOpen ? "80px" : "250px" }}
            animate={{ width: isSidebarOpen ? "250px" : "80px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            bg={sidebarBg}
            p={4}
            boxShadow="lg"
            position={{ base: "fixed", md: "relative" }}
            h="100vh"
            zIndex={2}
            exit={{ x: isMobile ? "-100%" : 0 }}
          >
            <VStack align="start" spacing={4}>
              {/* Sidebar Toggle */}
              <HStack
                w="full"
                justifyContent={isSidebarOpen ? "space-between" : "center"}
              >
                {isSidebarOpen && (
                  <Heading size="lg" fontWeight="normal" color="teal.200">
                    Cognivia
                  </Heading>
                )}
                <IconButton
                  icon={isSidebarOpen ? <FiChevronLeft /> : <FiMenu />}
                  aria-label="Toggle Sidebar"
                  onClick={toggleSidebar}
                  variant="ghost"
                  size="md"
                  color={textColor}
                />
              </HStack>

              {/* Navigation Links */}
              {modules.map((module) => (
                <HStack key={module.name} w="full">
                  <Tooltip
                    label={!isSidebarOpen ? module.name : ""}
                    placement="right"
                  >
                    <Button
                      justifyContent={isSidebarOpen ? "flex-start" : "center"}
                      variant="ghost"
                      w="full"
                      color={textColor}
                      fontWeight="medium"
                      fontSize="md"
                      _hover={{ bg: sidebarHoverBg, color: "white" }}
                      onClick={() => router.push(module.path)}
                    >
                      <IconButton
                        icon={<module.icon />}
                        aria-label={module.name}
                        variant="ghost"
                        size="md"
                        _hover={{ bg: "transparent" }}
                      />
                      {isSidebarOpen && module.name}
                    </Button>
                  </Tooltip>
                </HStack>
              ))}

              {/* Profile & Dark Mode Toggle */}
              <ProfileDialog isSidebarOpen={isSidebarOpen} />
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <MotionBox
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="blackAlpha.600"
          zIndex={1}
          onClick={toggleSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Main Content */}
      <Box flex={1} p={4}>
        {!isSidebarOpen && isMobile && (
          <IconButton
            icon={<FiMenu />}
            aria-label="Open Sidebar"
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            color={textColor}
            mb={4}
          />
        )}
        {children}
      </Box>
    </Flex>
  );
}
