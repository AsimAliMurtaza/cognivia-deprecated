"use client";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Select,
  Divider,
  Toast as toast,
} from "@chakra-ui/react";
import {
  FiUsers,
  FiTrash2,
  FiSearch,
  FiUser,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isTeacher = session?.user?.role === "teacher";

  //   useEffect(() => {
  //     if (isTeacher) {
  //       fetchUsers();
  //     }
  //   }, [isTeacher]);

  //   const fetchUsers = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/admin/users", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${session?.user?.accessToken}`,
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch users");
  //       }
  //       const data = await response.json();
  //       setUsers(data.users);
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err.message : "An unknown error occurred"
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleLogout = async () => {
    if (session?.user) {
      await fetch("/api/logging/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          userEmail: session.user.email,
          role: session.user.role,
          action: "Session Ended",
        }),
      });
    }

    signOut({ callbackUrl: "/" });
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?._id) {
      console.error("No user selected for deletion");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u._id !== selectedUser._id));

      toast({
        title: "User deleted",
        description: `${selectedUser.name} has been removed`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="xl" mb={2}>
            Teacher Dashboard
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Welcome back, {session?.user?.email}
          </Text>
        </Box>
        <Box gap={10}>
          <Badge
            colorScheme="purple"
            fontSize="1em"
            px={3}
            py={2}
            borderRadius="full"
          >
            Teacher
          </Badge>
          <Button
            colorScheme="purple"
            px={3}
            variant="ghost"
            py={1}
            borderRadius="full"
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Box>
      </Flex>

      {/* Stats Cards */}
      <Flex gap={6} mb={8} flexWrap="wrap">
        <Card flex="1" minW="200px">
          <CardHeader>
            <Flex align="center">
              <Icon as={FiUsers} boxSize={6} color="purple.500" mr={2} />
              <Heading size="md">Total Classes</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Heading size="2xl">{users.length}</Heading>
          </CardBody>
        </Card>
        
      </Flex>
    </Box>
  );
}
