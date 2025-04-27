// app/api/generate-quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini"; // Assuming your gemini.ts is in the lib directory
import dbConnect from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Security Measure 1: Rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
});

//Security Measure 2: Prompt Sanitize function
function sanitizePrompt(input: string): string {
  return input
    .replace(/<script.*?>.*?<\/script>/gi, "") // Remove scripts
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

async function formatQuiz(geminiOutput: string): Promise<{
  questions: string[];
  options: string[][];
  answers: string[];
} | null> {
  try {
    const questions: string[] = [];
    const options: string[][] = [];
    const answers: string[] = [];

    const lines = geminiOutput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let currentQuestion: string | null = null;
    let currentOptions: string[] = [];
    let parsingAnswers = false;
    const answerMap: { [key: number]: string } = {};
    let questionCounter = 0;

    for (const line of lines) {
      if (line.toLowerCase().startsWith("answers:")) {
        parsingAnswers = true;
        currentQuestion = null;
        currentOptions = [];
        continue;
      }

      if (!parsingAnswers) {
        const questionMatch = line.match(/^(\d+)\.\s*(.*)/);
        if (questionMatch) {
          if (currentQuestion) {
            questions.push(currentQuestion);
            options.push(currentOptions);
          }
          questionCounter = parseInt(questionMatch[1]);
          console.log("Question Counter:", questionCounter); // Debugging line
          currentQuestion = questionMatch[2].trim();
          currentOptions = [];
        } else if (currentQuestion) {
          const optionMatch = line.match(/^([A-Z])\s*(.*)/i); // Handles "A Option"
          const optionParenMatch = line.match(/^([A-Z])\)\s*(.*)/i); // Handles "A) Option"
          const optionBulletMatch = line.match(/^\*\s*([A-Z])\s*(.*)/i); // Handles "* A Option"
          const optionBulletParenMatch = line.match(/^\*\s*([A-Z])\)\s*(.*)/i); // Handles "* A) Option"

          if (optionMatch) {
            currentOptions.push(optionMatch[2].trim());
          } else if (optionParenMatch) {
            currentOptions.push(optionParenMatch[2].trim());
          } else if (optionBulletMatch) {
            currentOptions.push(optionBulletMatch[2].trim());
          } else if (optionBulletParenMatch) {
            currentOptions.push(optionBulletParenMatch[2].trim());
          }
        }
      } else {
        const answerMatchNumberLetter = line.match(/^(\d+)\.\s*([A-Z])$/i); // Handles "1. A"
        const answerMatchLetterOnly = line.match(/^([A-Z])$/i); // Handles "A"
        const answerMatchLetterColonValue = line.match(/^([A-Z])\s*(.*)/i); // Handles "A C" or "A) C"

        if (answerMatchNumberLetter) {
          answerMap[parseInt(answerMatchNumberLetter[1])] =
            answerMatchNumberLetter[2].toUpperCase();
        } else if (
          answerMatchLetterOnly &&
          Object.keys(answerMap).length < questions.length
        ) {
          answerMap[Object.keys(answerMap).length + 1] =
            answerMatchLetterOnly[1].toUpperCase();
        } else if (answerMatchLetterColonValue) {
          const letter = answerMatchLetterColonValue[1].toUpperCase();
          console.log("Letter:", letter); // Debugging line
          const value = answerMatchLetterColonValue[2].trim().toUpperCase();
          // Try to infer the question number based on the order
          if (
            value.length === 1 &&
            value.match(/^[A-Z]$/) &&
            Object.keys(answerMap).length < questions.length
          ) {
            answerMap[Object.keys(answerMap).length + 1] = value;
          }
        }
      }
    }

    // Add the last question and options
    if (currentQuestion) {
      questions.push(currentQuestion);
      options.push(currentOptions);
    }

    // Reconstruct answers array based on question order
    for (let i = 1; i <= questions.length; i++) {
      answers.push(answerMap[i] || ""); // Default to empty string if no answer found
    }

    // Basic validation
    if (
      questions.length === options.length &&
      questions.length === answers.filter(Boolean).length &&
      answers.filter(Boolean).length === questions.length // Ensure all questions have an answer
    ) {
      return { questions, options, answers };
    } else {
      console.warn("Inconsistent number of questions, options, or answers.");
      return null;
    }
  } catch (error) {
    console.error("Error formatting quiz:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Security Measure 1: Rate limiting
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const { prompt, userID } = await req.json(); // Expect userId in the request body
    const user_id = userID;

    if (!prompt || !user_id) {
      return NextResponse.json(
        { error: "Prompt and userId are required" },
        { status: 400 }
      );
    }

    // Check if user has enough credits BEFORE making the Gemini call
    const creditCheckRes = await fetch(
      `${process.env.NEXTAUTH_URL}/api/credits/check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user_id }),
      }
    );

    const creditData = await creditCheckRes.json();

    if (creditData.credits < 10) {
      return NextResponse.json({ redirectToPricing: true }, { status: 402 });
    }

    // Security Measure 2: Validate Input
    const sanitizedPrompt = sanitizePrompt(prompt);
    if (!sanitizedPrompt || typeof sanitizedPrompt !== "string") {
      return NextResponse.json(
        { error: "Invalid or too long prompt" },
        { status: 400 }
      );
    }

    const geminiOutput = await generateGeminiContent(
      `Generate a 10-question multiple-choice quiz on the following topic. Format each question with the question number followed by the question statement. Then, list four options, each on a new line, starting with the option letter (A, B, C, D) optionally followed by a parenthesis or a space, and then the option text. Provide the correct answers at the end, clearly labeled "Answers:", with each answer indicating the correct option letter, optionally preceded by the question number and a period.: ${sanitizedPrompt}`
    );

    if (geminiOutput) {
      const formattedQuiz = await formatQuiz(geminiOutput);
      await dbConnect(); // Connect to MongoDB

      const newQuiz = new Quiz({
        _id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a unique _id
        userID: user_id,
        topic: prompt,
        questions: formattedQuiz?.questions,
        options: formattedQuiz?.options,
        answers: formattedQuiz?.answers,
      });

      console.log("quiz ID:", newQuiz._id); // Log for debugging

      const savedQuiz = await newQuiz.save();
      console.log(savedQuiz);

      console.log("Formatted Quiz:", formattedQuiz); // Log for debugging

      if (formattedQuiz) {
        const creditsRes = await fetch(
          `${process.env.NEXTAUTH_URL}/api/credits/use`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user_id,
              amount: 10, // Deduct 10 credit for quiz generation
            }),
          }
        );

        if (creditsRes.status === 402) {
          console.error("Low credits", await creditsRes.json());
          return NextResponse.json(
            { error: "Failed to deduct credits" },
            { status: 500 }
          );
        }
        console.log("Credits deducted successfully.");

        return NextResponse.json(
          {
            message: "Quiz generated and saved successfully!",
            quizId: newQuiz._id, // Optionally return the ID
            generated_quiz: geminiOutput,
            questions: formattedQuiz.questions,
            options: formattedQuiz.options,
            answers: formattedQuiz.answers,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Failed to format the quiz from Gemini's output.",
            raw_output: geminiOutput,
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Failed to generate quiz from Gemini" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message || "Failed to communicate with Gemini API",
      },
      { status: 500 }
    );
  }
}
