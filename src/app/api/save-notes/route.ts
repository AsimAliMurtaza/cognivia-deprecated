// app/api/save-notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Note from "@/models/Note"; // Using your updated Note model

export async function POST(req: NextRequest) {
  try {
    const { content, userId, prompt } = await req.json();

    if (!content || !userId || !prompt) {
      return NextResponse.json(
        { error: "Content, userId, and prompt are required to save notes." },
        { status: 400 }
      );
    }

    await dbConnect();

    const newNote = new Note({
      _id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate a unique _id
      userID: userId,
      prompt: prompt,
      generated_quiz: content, // Assuming 'content' from the request is the generated quiz
      createdAt: new Date(), // This will be overridden by timestamps: true in the schema
    });

    const savedNote = await newNote.save();

    return NextResponse.json(
      { message: "Notes saved successfully!", noteId: savedNote._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving notes:", error);
    return NextResponse.json(
      { error: "Failed to save notes to the database." },
      { status: 500 }
    );
  }
}