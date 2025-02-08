import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);

  const client = await clientPromise;
  const db = client.db("quizDB"); // Change to your DB name
  const existingUser = await db.collection("users").findOne({ email });

  if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 400 });

  await db.collection("users").insertOne({ email, password: hashedPassword });
  return NextResponse.json({ message: "User created" }, { status: 201 });
}
