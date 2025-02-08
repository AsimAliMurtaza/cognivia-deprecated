"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Button, Box, VStack, Heading, Divider } from "@chakra-ui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.ok) router.push("/dashboard");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <VStack spacing={4} p={8} borderRadius="md" boxShadow="lg">
        <Heading>Login</Heading>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={handleLogin} isLoading={loading} colorScheme="blue">
          Login
        </Button>
        <Divider />
        <Button colorScheme="red" onClick={() => signIn("google")}>Login with Google</Button>
        <Button colorScheme="gray" onClick={() => signIn("github")}>Login with GitHub</Button>
      </VStack>
    </Box>
  );
}
