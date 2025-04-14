import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  req: NextRequest,
  { params }: { params: { userID: string } }
) {
  const { userID } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.id !== userID) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await dbConnect();
    const quizzes = await Quiz.find({ userID }).sort({ createdAt: -1 });

    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    return NextResponse.json(
      { message: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
