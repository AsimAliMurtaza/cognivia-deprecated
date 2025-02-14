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

// Framer Motion Components
const MotionBox = motion(Box);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Light & Dark Mode Colors
  const sidebarBg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Responsive Behavior
  const isMobile = useBreakpointValue({ base: true, md: false });

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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      if (!isSidebarOpen) onOpen();
      else onClose();
    }
  };

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <AnimatePresence>
        {(!isMobile || isSidebarOpen) && (
          <MotionBox
            w={{ base: "250px", md: isSidebarOpen ? "250px" : "70px" }}
            bg={sidebarBg}
            p={4}
            boxShadow="lg"
            borderRight="1px solid"
            borderColor="gray.200"
            position={{ base: "fixed", md: "relative" }}
            h="100vh"
            zIndex={2}
            initial={{ x: isMobile ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? "-100%" : 0 }}
            transition={{ duration: 0.2 }}
          >
            <VStack align="start" spacing={4}>
              {/* Sidebar Toggle */}
              <HStack
                w="full"
                justifyContent={isSidebarOpen ? "space-between" : "center"}
              >
                {isSidebarOpen && (
                  <Heading size="md" color="teal.400">
                    Cognivia
                  </Heading>
                )}
                <IconButton
                  icon={isSidebarOpen ? <FiChevronLeft /> : <FiMenu />}
                  aria-label="Toggle Sidebar"
                  onClick={toggleSidebar}
                  variant="ghost"
                  size="sm"
                  color={textColor}
                />
              </HStack>

              {/* Navigation Links */}
              {modules.map((module) => (
                <Tooltip
                  label={!isSidebarOpen ? module.name : ""}
                  placement="right"
                  key={module.name}
                >
                  <Button
                    leftIcon={<module.icon />}
                    variant="ghost"
                    w="full"
                    justifyContent={isSidebarOpen ? "flex-start" : "center"}
                    color={textColor}
                    _hover={{ bg: "teal.100", color: "teal.600" }}
                    onClick={() => router.push(module.path)}
                  >
                    {isSidebarOpen && module.name}
                  </Button>
                </Tooltip>
              ))}

              {/* Profile & Dark Mode Toggle */}
              <ProfileDialog isSidebarOpen={isSidebarOpen} />
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Backdrop for Mobile */}
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
      <Box flex={1} p={4} >
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