"use client";

import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  stripeSessionId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  purchasedAt: string;
  productName: string;
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const data = await res.json();
        setTransactions(data.transactions);
      } catch (err) {
        setError((err as Error).message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Box
      bg={cardBg}
      p={8}
      rounded="xl"
      shadow="md"
      maxW="6xl"
      mx="auto"
      mt={10}
    >
      <Heading mb={6} size="lg" textAlign="center">
        Transaction History
      </Heading>

      {loading ? (
        <Center>
          <Spinner size="xl" />
        </Center>
      ) : error ? (
        <Text color="red.500" textAlign="center">
          {error}
        </Text>
      ) : transactions.length === 0 ? (
        <Text textAlign="center">No transactions yet.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Status</Th>
              <Th isNumeric>Amount</Th>
              <Th>Currency</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((tx) => (
              <Tr key={tx._id}>
                <Td>{tx.productName}</Td>
                <Td>{tx.status}</Td>
                <Td isNumeric>${(tx.amount / 100).toFixed(2)}</Td>
                <Td>{tx.currency.toUpperCase()}</Td>
                <Td>{new Date(tx.purchasedAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
