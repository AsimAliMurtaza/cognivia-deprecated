import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SessionLogger() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      fetch("/api/logging/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          userEmail: session.user.email,
          role: session.user.role,
          action: "Session Started",
        }),
      });
    }
  }, [session?.user]);

  return null;
}
