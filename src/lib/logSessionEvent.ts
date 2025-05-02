// lib/logSessionEvent.ts
import dbConnect from "./mongodb";
import SessionLog from "@/models/SessionLog";

export async function logSessionEvent({
  userId,
  email,
  event,
  ip,
  userAgent,
}: {
  userId: string;
  email: string;
  event: "login" | "logout" | "session_refresh";
  ip?: string;
  userAgent?: string;
}) {
  await dbConnect();
  await SessionLog.create({ userId, email, event, ip, userAgent });
}
