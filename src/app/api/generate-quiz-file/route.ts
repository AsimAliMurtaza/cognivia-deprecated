import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini";
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { htmlToText } from "html-to-text";

// Initialize Redis and rate limiter
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

// Utility functions
function sanitizePrompt(input: string): string {
  const plainText = htmlToText(input, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });
  return plainText.replace(/\s+/g, " ").trim();
}

async function formatQuiz(geminiOutput: string) {
  try {
    const result: {
      questions: string[];
      options: string[][];
      answers: string[];
    } = {
      questions: [],
      options: [],
      answers: [],
    };

    const sections = geminiOutput.split(/(?=Answers?:)/i);
    const questionsSection = sections[0];
    const answersSection = sections[1] || "";

    // Process questions
    const questionBlocks = questionsSection.split(/\n\s*\n/);
    for (const block of questionBlocks) {
      const lines = block.split("\n").filter((line) => line.trim());
      if (lines.length < 2) continue;

      const questionMatch = lines[0].match(/^\d+\.\s*(.+)/);
      if (!questionMatch) continue;

      result.questions.push(questionMatch[1].trim());
      const currentOptions: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const optionMatch =
          lines[i].match(/^[A-Z][).]\s*(.+)/i) ||
          lines[i].match(/^\*\s*[A-Z][).]\s*(.+)/i) ||
          lines[i].match(/^[A-Z]\s+(.+)/i);
        if (optionMatch) {
          currentOptions.push(optionMatch[1].trim());
        }
      }

      result.options.push(currentOptions);
    }

    // Process answers
    const answerLines = answersSection.split("\n");
    const answerMap: Record<number, string> = {};

    for (const line of answerLines) {
      const answerMatch =
        line.match(/^(\d+)[).]\s*([A-Z])/i) || line.match(/^([A-Z])$/i);
      if (answerMatch) {
        const qNum = answerMatch[1]
          ? parseInt(answerMatch[1])
          : result.answers.length + 1;
        answerMap[qNum] =
          answerMatch[2]?.toUpperCase() || answerMatch[1]?.toUpperCase();
      }
    }

    // Map answers to questions
    for (let i = 1; i <= result.questions.length; i++) {
      result.answers.push(answerMap[i] || "");
    }

    // Validation
    if (
      result.questions.length !== result.options.length ||
      result.questions.length !== result.answers.length ||
      result.answers.some((a) => !a)
    ) {
      console.warn("Quiz format validation failed", {
        questions: result.questions.length,
        options: result.options.length,
        answers: result.answers.length,
        emptyAnswers: result.answers.filter((a) => !a).length,
      });
      return null;
    }

    return result;
  } catch (error) {
    console.error("Quiz formatting error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later.", success: false },
        { status: 429 }
      );
    }

    // Parse JSON body
    const { text, userID, filename } = await req.json();

    if (!text || !userID) {
      return NextResponse.json(
        { error: "Text content and user ID are required", success: false },
        { status: 400 }
      );
    }

    const sanitizedPrompt = sanitizePrompt(text);

    if (!sanitizedPrompt || sanitizedPrompt.length < 100) {
      return NextResponse.json(
        {
          error: "Text content is too short (minimum 100 characters required)",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check user credits
    const creditCheck = await fetch(
      `${process.env.NEXTAUTH_URL}/api/credits/check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userID }),
      }
    );

    if (!creditCheck.ok) {
      const error = await creditCheck.json();
      throw new Error(error.error || "Failed to check credits");
    }

    const creditData = await creditCheck.json();
    if (creditData.credits < 10) {
      return NextResponse.json(
        {
          redirectToPricing: true,
          credits: creditData.credits,
          success: false,
        },
        { status: 402 }
      );
    }

    // Generate quiz content
    const prompt = `Generate a 10-question multiple-choice quiz based on the following content. 
Format each question with a number (1., 2., etc.) followed by the question text. 
List options with letters (A, B, C, etc.) followed by the option text.
After all questions, include an "Answers:" section that lists the correct letter for each question in order.

Content: ${sanitizedPrompt}`;

    const geminiOutput = await generateGeminiContent(prompt);
    if (!geminiOutput) {
      throw new Error("Failed to generate quiz content");
    }

    // Format and validate quiz
    const formattedQuiz = await formatQuiz(geminiOutput);
    if (!formattedQuiz) {
      return NextResponse.json(
        {
          error: "The generated quiz format was invalid",
          raw_output: geminiOutput,
          success: false,
        },
        { status: 422 }
      );
    }

    // Save to database
    await dbConnect();
    const newQuiz = new Quiz({
      _id: `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      userID: userID,
      topic: filename?.replace(/\.[^/.]+$/, "") || "Untitled Quiz",
      questions: formattedQuiz.questions,
      options: formattedQuiz.options,
      answers: formattedQuiz.answers,
      createdAt: new Date(),
    });

    await newQuiz.save();

    // Deduct credits (fire and forget)
    fetch(`${process.env.NEXTAUTH_URL}/api/credits/use`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userID, amount: 10 }),
    }).catch((err) => console.error("Failed to deduct credits:", err));

    return NextResponse.json(
      {
        success: true,
        quizId: newQuiz._id,
        questions: formattedQuiz.questions,
        options: formattedQuiz.options,
        answers: formattedQuiz.answers,
        topic: newQuiz.topic,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        success: false,
      },
      { status: 500 }
    );
  }
}
