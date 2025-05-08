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
  Badge,
  Flex,
  Stack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { FiSearch, FiDollarSign, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";

interface Transaction {
  _id: string;
  stripeSessionId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string; // Make optional
  purchasedAt: string;
  productPlan: string;
  type?: "subscription" | "credit_pack"; // Make optional
}

const MotionBox = motion(Box);

const getStatusBadgeColorScheme = (status: string) => {
  switch (status?.toLowerCase()) {
    case "succeeded":
      return "green";
    case "pending":
      return "yellow";
    case "failed":
      return "red";
    default:
      return "gray";
  }
};

const getTypeBadgeColorScheme = (type?: string) => {
  switch (type) {
    case "subscription":
      return "blue";
    case "credit_pack":
      return "purple";
    default:
      return "gray";
  }
};

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const textColorTwo = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.900", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");
  const threadColor = useColorModeValue("gray.100", "gray.700");
  const trColor = useColorModeValue("gray.50", "gray.700");
  const textColorThree = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        if (!res.ok) throw new Error("Failed to fetch transaction history.");

        const data = await res.json();
        // Ensure all transactions have required fields
        //disable-eslint-next-line @typescript-eslint/no-explicit-any
        const processedTransactions = data.transactions.map(
          (tx: Transaction) => ({
            //enable-eslint-next-line @typescript-eslint/no-explicit-any
            ...tx,
            type:
              tx.type ||
              (tx.productPlan?.toLowerCase().includes("credit")
                ? "credit_pack"
                : "subscription"),
            paymentMethod: tx.paymentMethod || "Card",
            status: tx.status || "unknown",
          })
        );
        setTransactions(processedTransactions);
        setFilteredTransactions(processedTransactions);
      } catch (err) {
        setError((err as Error).message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let results = transactions;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (tx) =>
          tx.productPlan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(
        (tx) => tx.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      results = results.filter((tx) => tx.type === typeFilter);
    }

    setFilteredTransactions(results);
  }, [searchTerm, statusFilter, typeFilter, transactions]);

  return (
    <Box
      bg={bg}
      minH="100vh"
      py={12}
      px={[4, 8]}
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
    >
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        bg={cardBg}
        p={8}
        rounded="2xl"
        shadow="lg"
        maxW="6xl"
        mx="auto"
        width="full"
      >
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <Heading size="xl" fontWeight="semibold" color={headingColor}>
            Payment History
          </Heading>

          <Stack direction={["column", "row"]} spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search transactions..."
                bg={inputBg}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                rounded="full"
              />
            </InputGroup>

            <HStack spacing={4}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg={inputBg}
                rounded="full"
                minW="150px"
              >
                <option value="all">All Statuses</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </Select>

              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                bg={inputBg}
                rounded="full"
                minW="150px"
              >
                <option value="all">All Types</option>
                <option value="subscription">Subscriptions</option>
                <option value="credit_pack">Credit Packs</option>
              </Select>
            </HStack>
          </Stack>
        </Flex>

        {loading ? (
          <Center py={12}>
            <Stack align="center" spacing={4}>
              <Spinner size="xl" color={accentColor} thickness="3px" />
              <Text color={textColor}>Loading your transactions...</Text>
            </Stack>
          </Center>
        ) : error ? (
          <Center py={12}>
            <Text color="red.500">{error}</Text>
          </Center>
        ) : filteredTransactions.length === 0 ? (
          <Center py={12}>
            <Stack align="center" spacing={2}>
              <Text color={textColor} fontSize="lg">
                No transactions found
              </Text>
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" ? (
                <Button
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </Stack>
          </Center>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" borderRadius="lg" overflow="hidden">
              <Thead bg={threadColor}>
                <Tr>
                  <Th color={textColor} fontWeight="semibold">
                    Item
                  </Th>
                  <Th color={textColor} fontWeight="semibold">
                    Type
                  </Th>
                  <Th color={textColor} fontWeight="semibold">
                    Status
                  </Th>
                  <Th color={textColor} fontWeight="semibold" isNumeric>
                    Amount
                  </Th>
                  <Th color={textColor} fontWeight="semibold">
                    Date
                  </Th>
                  <Th color={textColor} fontWeight="semibold">
                    Payment Method
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((tx) => (
                  <Tr
                    key={tx._id}
                    borderColor={borderColor}
                    _hover={{ bg: trColor }}
                  >
                    <Td>
                      <Text fontWeight="medium" color={textColor}>
                        {tx.productPlan || "Unknown Product"}
                      </Text>
                      <Text fontSize="sm" color={textColorTwo}>
                        {tx.userEmail || "No email"}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={getTypeBadgeColorScheme(tx.type)}
                        borderRadius="full"
                        px={2}
                        py={1}
                        textTransform="capitalize"
                      >
                        {tx.type ? tx.type.replace("_", " ") : "Unknown"}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={getStatusBadgeColorScheme(tx.status)}
                        borderRadius="full"
                        px={2}
                        py={1}
                      >
                        {tx.status?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </Td>
                    <Td isNumeric color={textColor} fontWeight="medium">
                      ${(tx.amount / 100).toFixed(2)}
                    </Td>
                    <Td color={textColor}>
                      <Tooltip
                        label={
                          tx.purchasedAt
                            ? format(new Date(tx.purchasedAt), "PPpp")
                            : "Unknown date"
                        }
                      >
                        <Flex align="center">
                          <Icon as={FiCalendar} mr={2} />
                          {tx.purchasedAt
                            ? format(new Date(tx.purchasedAt), "MMM dd, yyyy")
                            : "N/A"}
                        </Flex>
                      </Tooltip>
                    </Td>
                    <Td color={textColor}>
                      <Flex align="center">
                        <Icon as={FiDollarSign} mr={2} />
                        {tx.paymentMethod || "Card"}
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {!loading && !error && filteredTransactions.length > 0 && (
          <Flex justify="flex-end" mt={4}>
            <Text color={textColorThree} fontSize="sm">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </Text>
          </Flex>
        )}
      </MotionBox>
    </Box>
  );
}
