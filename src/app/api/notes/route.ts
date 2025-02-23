import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const notes = await Note.find({});
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
