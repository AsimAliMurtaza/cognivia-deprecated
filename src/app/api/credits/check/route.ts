import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();
  const { userId } = await req.json();

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ credits: user.credits });
}
