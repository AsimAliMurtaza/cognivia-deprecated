"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Button, Heading } from "@chakra-ui/react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Heading>Welcome, {session.user?.email}</Heading>
      <Button onClick={() => signOut()} colorScheme="red" mt={4}>
        Sign Out
      </Button>
    </Box>
  );
}
