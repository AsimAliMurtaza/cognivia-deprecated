import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Fetch all notes from the database
    const notes = await Note.find({});

    // Return successful response with notes
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);

    // Return error response
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}
