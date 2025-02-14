"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Tooltip,
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
import SettingsPage from "@/components/Settings";
import AIAssistant from "@/components/AIAssistant";
import NoteGenerator from "@/components/NoteGenerator";
import QuizGeneration from "@/components/QuizGeneration";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState("Overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Light & Dark Mode Colors
  const sidebarBg = useColorModeValue("gray.100", "gray.900");
  const mainBg = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cardBg = useColorModeValue("white", "gray.700");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const modules = [
    { name: "Overview", icon: FiHome },
    { name: "Quizzes", icon: FiBook },
    { name: "AI Assistant", icon: FiMessageSquare },
    { name: "Performance Report", icon: FiBarChart },
    { name: "Smart Notes", icon: FiEdit },
    { name: "Settings", icon: FiSettings },
  ];

  const renderModuleContent = () => {
    switch (selectedModule) {
      case "Overview":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" p={4}>
            <CardHeader>
              <Heading color={textColor} size="md">
                Overview
              </Heading>
            </CardHeader>
            <CardBody>
              <Text color={textColor}>
                Welcome back, {session.user?.email}! Here&#39;s your progress.
              </Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
                <Card bg="teal.400" color="white" borderRadius="lg" p={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Completed Quizzes
                  </Text>
                  <Text fontSize="2xl">12</Text>
                </Card>
                <Card bg="blue.400" color="white" borderRadius="lg" p={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Average Score
                  </Text>
                  <Text fontSize="2xl">85%</Text>
                </Card>
                <Card bg="purple.400" color="white" borderRadius="lg" p={4}>
                  <Text fontSize="lg" fontWeight="bold">
                    Notes Created
                  </Text>
                  <Text fontSize="2xl">24</Text>
                </Card>
              </Grid>
            </CardBody>
          </Card>
        );
      case "Settings":
        return <SettingsPage />;
      case "AI Assistant":
        return <AIAssistant />;
      case "Smart Notes":
        return <NoteGenerator />;  
      default:
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md" p={4}>
            <CardHeader>
              <Heading size="md" color={textColor}>
                {selectedModule}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text color={textColor}>Content for {selectedModule}.</Text>
            </CardBody>
          </Card>
        );
    }
  };

  return (
    <Flex minH="100vh" bg={mainBg}>
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
                color={selectedModule === module.name ? "teal.400" : textColor}
                _hover={{ bg: "teal.100", color: "teal.600" }}
                onClick={() => setSelectedModule(module.name)}
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
      <Box
        sx={{
          flex: 1,
          overflowY: "none",
        }}
      >
        {renderModuleContent()}
      </Box>
    </Flex>
  );
}