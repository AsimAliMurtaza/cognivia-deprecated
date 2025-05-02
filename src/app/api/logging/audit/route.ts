import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";

// GET request – fetch recent audit logs
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json(logs);
  } catch (error) {
    console.error("❌ Error fetching audit logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST request – store a new audit log
export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, role, action } = await req.json();

    if (!userId || !userEmail || !role || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const newLog = await AuditLog.create({
      userId,
      userEmail,
      role,
      action,
    });

    return NextResponse.json({ success: true, log: newLog }, { status: 201 });
  } catch (error) {
    console.error("❌ Error logging action:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
