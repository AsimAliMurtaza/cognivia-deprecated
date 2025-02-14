// app/dashboard/layout.tsx
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Light & Dark Mode Colors
  const sidebarBg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");

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

  return (
    <Flex minH="100vh">
      {/* Sidebar */}
      <Box
        w={isSidebarOpen ? "250px" : "70px"}
        bg={sidebarBg}
        p={4}
        boxShadow="lg"
        borderRight="1px solid"
        borderColor="gray.200"
        transition="width 0.3s"
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
              onClick={() => setSidebarOpen(!isSidebarOpen)}
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
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4}>
        {children}
      </Box>
    </Flex>
  );
}
