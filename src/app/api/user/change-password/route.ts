import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options"; // Adjust path as needed
import dbConnect from "@/lib/mongodb"; // Your MongoDB connection function
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Session:", session.user.email);
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email: session.user.email });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return NextResponse.json(
        { error: "Invalid current password" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Password update failed" },
      { status: 500 }
    );
  }
}
