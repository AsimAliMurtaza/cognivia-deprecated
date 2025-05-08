import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, role, action } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.ip ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "unknown";

    if (!userId || !userEmail || !role || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const log = await AuditLog.create({
      userId,
      userEmail,
      role,
      action,
      type: "session",
      ip,
      userAgent,
    });

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (err) {
    console.error("Session log error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
