import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store (for testing purposes)
let results: any[] = [];

export async function GET() {
  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.username || body.score == null || body.total == null || body.percentage == null) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const newResult = {
    id: Date.now(),
    ...body,
    createdAt: new Date().toISOString(),
  };

  results.push(newResult);

  return NextResponse.json({ message: "Result saved", result: newResult }, { status: 201 });
}
