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

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: "admin" | "user") => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      console.log("Role updated:", data.user);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

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
            Admin Dashboard
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
            Admin
          </Badge>
          <Button
            colorScheme="purple"
            px={3}
            variant="ghost"
            py={1}
            borderRadius="full"
            onClick={() => {
              router.push("/admin/dashboard/logs");
            }}
          >
            LOGS
          </Button>
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
              <Heading size="md">Total Users</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Heading size="2xl">{users.length}</Heading>
          </CardBody>
        </Card>

        <Card flex="1" minW="200px">
          <CardHeader>
            <Flex align="center">
              <Icon as={FiUser} boxSize={6} color="blue.500" mr={2} />
              <Heading size="md">Regular Users</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Heading size="2xl">
              {users.filter((u) => u.role === "user").length}
            </Heading>
          </CardBody>
        </Card>

        <Card flex="1" minW="200px">
          <CardHeader>
            <Flex align="center">
              <Icon as={FiShield} boxSize={6} color="green.500" mr={2} />
              <Heading size="md">Admins</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Heading size="2xl">
              {users.filter((u) => u.role === "admin").length}
            </Heading>
          </CardBody>
        </Card>
      </Flex>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <Heading size="lg">User Management</Heading>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {loading ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" />
            </Flex>
          ) : error ? (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error loading users</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>User</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Joined</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user._id}>
                      <Td>
                        <Flex align="center">
                          <Avatar
                            name={user.name}
                            src={user.image}
                            size="sm"
                            mr={3}
                          />
                          <Text fontWeight="medium">{user.name}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Flex align="center">
                          <Icon as={FiMail} mr={2} color="gray.500" />
                          {user.email}
                        </Flex>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            user.role === "admin" ? "purple" : "blue"
                          }
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {user.role}
                        </Badge>
                      </Td>
                      <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            updateUserRole(
                              user._id,
                              e.target.value as "admin" | "user"
                            )
                          }
                          size="sm"
                          maxW="150px"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </Select>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="red"
                          leftIcon={<FiTrash2 />}
                          onClick={() => {
                            if (user?._id) {
                              setSelectedUser(user);
                              onOpen();
                            } else {
                              console.error("Invalid user data:", user);
                            }
                          }}
                          isDisabled={user._id === session?.user?.id}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm User Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <Text>
                Are you sure you want to permanently delete{" "}
                <strong>{selectedUser.name}</strong> ({selectedUser.email})?
                This action cannot be undone.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteUser}
              isLoading={isDeleting}
              loadingText="Deleting..."
            >
              Delete User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
