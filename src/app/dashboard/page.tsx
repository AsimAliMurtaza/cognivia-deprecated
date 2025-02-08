"use client";

import { useSession, signOut } from "next-auth/react";
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
  Divider,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiHome,
  FiBook,
  FiBarChart,
  FiSettings,
  FiLogOut,
  FiEdit,
  FiMessageSquare,
  FiChevronLeft,
  FiMenu,
} from "react-icons/fi";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState("Overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  const sidebarBg = useColorModeValue("#F3E5F5", "#gray.50"); // Soft pastel purple
  const mainBg = useColorModeValue("#E0F7FA", "gray.50"); // Soft pastel teal
  const cardBg = useColorModeValue("white", "white");

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
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading color="black" size="md">
                Overview
              </Heading>
            </CardHeader>
            <CardBody>
              <Text
                sx={{
                  color: "black",
                }}
              >
                Welcome back, {session.user?.email}! Here's a quick overview of
                your progress.
              </Text>
              <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
                <Card bg="#6EC3C4" color="white" borderRadius="lg">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      Completed Quizzes
                    </Text>
                    <Text fontSize="2xl">12</Text>
                  </CardBody>
                </Card>
                <Card bg="#A5D8DD" color="white" borderRadius="lg">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      Average Score
                    </Text>
                    <Text fontSize="2xl">85%</Text>
                  </CardBody>
                </Card>
                <Card bg="#F3E5F5" color="gray.800" borderRadius="lg">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      Notes Created
                    </Text>
                    <Text fontSize="2xl">24</Text>
                  </CardBody>
                </Card>
              </Grid>
            </CardBody>
          </Card>
        );
      case "Quizzes":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading size="md">Quizzes</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                Explore and take quizzes tailored to your learning needs.
              </Text>
              <Grid templateColumns="repeat(2, 1fr)" gap={6} mt={4}>
                <Card bg="#6EC3C4" color="white" borderRadius="lg">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      Math Quiz
                    </Text>
                    <Text>10 Questions</Text>
                  </CardBody>
                </Card>
                <Card bg="#A5D8DD" color="white" borderRadius="lg">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold">
                      Science Quiz
                    </Text>
                    <Text>15 Questions</Text>
                  </CardBody>
                </Card>
              </Grid>
            </CardBody>
          </Card>
        );
      case "AI Assistant":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading size="md">AI Assistant</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                Ask questions and get instant answers from our AI assistant.
              </Text>
            </CardBody>
          </Card>
        );
      case "Performance Report":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading size="md">Performance Report</Heading>
            </CardHeader>
            <CardBody>
              <Text>View detailed reports on your quiz performance.</Text>
            </CardBody>
          </Card>
        );
      case "Smart Notes":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading size="md">Smart Notes</Heading>
            </CardHeader>
            <CardBody>
              <Text>Create and manage your smart notes here.</Text>
            </CardBody>
          </Card>
        );
      case "Settings":
        return (
          <Card bg={cardBg} borderRadius="lg" boxShadow="md">
            <CardHeader>
              <Heading size="md">Settings</Heading>
            </CardHeader>
            <CardBody>
              <Text>Customize your dashboard and preferences.</Text>
            </CardBody>
          </Card>
        );
      default:
        return null;
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
          {/* Sidebar Toggle Button */}
          <HStack
            w="full"
            justifyContent={isSidebarOpen ? "space-between" : "center"}
          >
            {isSidebarOpen && (
              <Heading size="md" color="#6EC3C4">
                Cognivia
              </Heading>
            )}
            <IconButton
              icon={
                isSidebarOpen ? (
                  <FiChevronLeft color="black" />
                ) : (
                  <FiMenu color="black" />
                )
              }
              aria-label="Toggle Sidebar"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              variant="ghost"
              size="sm"
            />
          </HStack>

          {/* Navigation Links */}
          {modules.map((module) => (
            <Tooltip
              label={isSidebarOpen ? "" : module.name}
              placement="right"
              key={module.name}
            >
              <Button
                leftIcon={<module.icon />}
                variant="ghost"
                w="full"
                justifyContent={isSidebarOpen ? "flex-start" : "center"}
                color={selectedModule === module.name ? "#6EC3C4" : "gray.700"}
                _hover={{ bg: "#E0F7FA", color: "#6EC3C4" }}
                onClick={() => setSelectedModule(module.name)}
              >
                {isSidebarOpen && module.name}
              </Button>
            </Tooltip>
          ))}

          <Divider my={4} />

          {/* Sign Out Button */}
          <Tooltip label={isSidebarOpen ? "" : "Sign Out"} placement="right">
            <Button
              leftIcon={<FiLogOut />}
              variant="ghost"
              w="full"
              justifyContent={isSidebarOpen ? "flex-start" : "center"}
              color="gray.700"
              _hover={{ bg: "#E0F7FA", color: "red.500" }}
              onClick={() => signOut()}
            >
              {isSidebarOpen && "Sign Out"}
            </Button>
          </Tooltip>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8}>
        <Heading size="xl" mb={6} color="#6EC3C4">
          {selectedModule}
        </Heading>
        {renderModuleContent()}
      </Box>
    </Flex>
  );
}
