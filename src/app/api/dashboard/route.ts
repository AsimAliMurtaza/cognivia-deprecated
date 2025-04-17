import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizResult from "@/models/QuizResult";
import Note from "@/models/Note";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userID } = await req.json();

    // Count quizzes created
    const quizzesCount = await Quiz.countDocuments({ userID });

    // Average quiz result percentage
    const resultsAgg = await QuizResult.aggregate([
      { $match: { userID } },
      {
        $group: {
          _id: null,
          avgPercentage: { $avg: "$percentage" },
        },
      },
    ]);
    const averageScore = resultsAgg[0]?.avgPercentage || 0;

    // Count notes created
    const notesCount = await Note.countDocuments({ userID });

    const takenQuizCount = await QuizResult.countDocuments({ userID });

    // Fetch latest 2 quizzes (sorted by createdAt descending)
    const recentQuizzes = await Quiz.find({ userID })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("topic createdAt");

    // Fetch latest 2 notes (sorted by createdAt descending)
    const recentNotes = await Note.find({ userID })
      .sort({ createdAt: -1 })
      .limit(2)
      .select("prompt createdAt");

    return NextResponse.json({
      quizzesCount,
      averageScore: Math.round(averageScore),
      notesCount,
      recentQuizzes,
      recentNotes,
      takenQuizCount,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
