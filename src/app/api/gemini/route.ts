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
  // 1. Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1]; // "Bearer <token>" → "<token>"

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
    "You are an educational assistant" +
    sanitizedPrompt;
  const response = await generateGeminiContent(newSanitizedPrompt);

  return NextResponse.json({ response });
}
