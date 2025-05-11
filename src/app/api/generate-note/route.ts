import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

// Security Measure 1: Rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 requests per 60 seconds per IP
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

export async function POST(req: NextRequest) {
  // 1. Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate token using next-auth
  const verifiedToken = await getToken({ req, secret, raw: true });

  if (!verifiedToken) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const { prompt, user_id } = await req.json();

  // Security Measure 3: Validate Input
  if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
    return NextResponse.json(
      { error: "Invalid or too long prompt" },
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

  const sanitizedPrompt = sanitizePrompt(prompt);
  const newSanitizedPrompt =
    "You are an educational assistant" + sanitizedPrompt;
  const response = await generateGeminiContent(newSanitizedPrompt);

  if (response) {
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
  }

  return NextResponse.json({ response });
}
