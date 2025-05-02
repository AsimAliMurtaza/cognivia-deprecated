"use client";
import { AuditLog } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

const roleColor: Record<string, string> = {
  admin: "purple",
  user: "blue",
};

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch("/api/logging/audit");
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        toast({
          title: "Error fetching logs",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [toast]);

  return (
    <Box p={{ base: 4, md: 8 }} bg="gray.50" minH="100vh">
      <Flex justify="space-between" align="center" mb={8}>
        <Heading fontSize="2xl" fontWeight="bold">
          Audit Logs
        </Heading>

        <Flex gap={4} align="center">
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
            px={4}
            py={2}
            variant="ghost"
            borderRadius="full"
            onClick={() => router.push("/admin/dashboard")}
          >
            Back
          </Button>
        </Flex>
      </Flex>

      <Card borderRadius="2xl" boxShadow="sm" bg="white">
        <CardBody p={0}>
          {loading ? (
            <Flex justify="center" p={10}>
              <Spinner size="lg" />
            </Flex>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="gray.100">
                  <Tr>
                    <Th>User</Th>
                    <Th>Role</Th>
                    <Th>Action</Th>
                    <Th>IP Address</Th>
                    <Th>User Agent</Th>
                    <Th>Timestamp</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logs.map((log) => (
                    <Tr key={log._id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Flex align="center" gap={3}>
                          <Avatar size="sm" name={log.userEmail} />
                          <Text fontWeight="medium">{log.userEmail}</Text>
                        </Flex>
                      </Td>
                      <Td>
                        <Badge
                          px={2}
                          py={1}
                          fontSize="xs"
                          borderRadius="full"
                          colorScheme={roleColor[log.role] || "gray"}
                        >
                          {log.role.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{log.action}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {log.ip || "N/A"}
                        </Text>
                      </Td>
                      <Td
                        maxW="240px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        <Text fontSize="xs" color="gray.500">
                          {log.userAgent || "N/A"}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(log.createdAt).toLocaleString()}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
