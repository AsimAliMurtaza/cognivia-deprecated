import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import QuizResultModel from "@/models/QuizResult";
import QuizModel from "@/models/Quiz";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userID } = await req.json();

    const results = await QuizResultModel.find({ userID }).sort({ createdAt: -1 });

    const totalQuizzes = results.length;

    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            results.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalQuizzes
          )
        : 0;

    // Fetch related quizzes for topics
    const quizIDs = results.map((r) => r.quizID);
    const quizzes = await QuizModel.find({ _id: { $in: quizIDs } });

    // Create a map of quizID -> topic
    const quizTopicMap = new Map();
    quizzes.forEach((quiz) => {
      quizTopicMap.set(quiz._id.toString(), quiz.topic || "Unknown");
    });

    // Count topics based on quiz results
    const topicFrequency: Record<string, number> = {};
    results.forEach((r) => {
      const topic = quizTopicMap.get(r.quizID?.toString()) || "Unknown";
      topicFrequency[topic] = (topicFrequency[topic] || 0) + 1;
    });

    const topTopics = Object.entries(topicFrequency)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recentScores = results.slice(0, 5).map((res) => ({
      topic: quizTopicMap.get(res.quizID?.toString()) || "Unknown",
      score: res.score || 0,
      percentage: res.percentage || 0,
      date: res.createdAt,
    }));

    return NextResponse.json({
      totalQuizzes,
      averageScore,
      topTopics,
      recentScores,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}
