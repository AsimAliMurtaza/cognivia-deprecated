// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Make sure this exists and exports your authOptions
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; // Your Mongoose User model

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  console.log(req);
  // Allow only admins
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();

    const users = await User.find(
      {},
      "id name email role image createdAt"
    ).sort({
      createdAt: -1,
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}