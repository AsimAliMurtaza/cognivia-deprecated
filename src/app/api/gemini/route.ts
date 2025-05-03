import { NextRequest, NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini";
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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const prompt = body?.prompt;

  // Security Measure 3: Validate Input
  if (!prompt || typeof prompt !== "string" || prompt.length > 1000) {
    return NextResponse.json(
      { error: "Invalid or too long prompt" },
      { status: 400 }
    );
  }

  const sanitizedPrompt = sanitizePrompt(prompt);
  const newSanitizedPrompt =
    "You are strictly an educational assistant. Strictly avoid political, racist, stereotypes, violent, or controversial material or user queries. Tell user to refrain from such queries but if the user asks about something educational, then help them according to following prompt" +
    sanitizedPrompt;
  const response = await generateGeminiContent(newSanitizedPrompt);

  return NextResponse.json({ response });
}
