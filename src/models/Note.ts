import mongoose, { Schema, Document, models, model } from "mongoose";

// Define the TypeScript interface
export interface INote extends Document {
  userID: string;
  noteID: string;
  content: string;
}

// Define the schema
const NoteSchema = new Schema<INote>(
  {
    userID: { type: String, required: true },
    noteID: { type: String, required: true, unique: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Use models cache to avoid recompilation on hot reload
const Note = models.Note || model<INote>("Note", NoteSchema);

export default Note;
