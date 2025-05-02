"use client";
import { AuditLog } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Heading,
  useToast,
} from "@chakra-ui/react";

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

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
    <Box p={6}>
      <Heading size="lg" mb={4}>Audit Logs</Heading>

      {loading ? (
        <Spinner />
      ) : (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Action</Th>
              <Th>Timestamp</Th>
            </Tr>
          </Thead>
          <Tbody>
            {logs.map((log) => (
              <Tr key={log._id}>
                <Td>{log.userEmail}</Td>
                <Td>{log.role}</Td>
                <Td>{log.action}</Td>
                <Td>{new Date(log.createdAt).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
