// models/Note.ts
import { Schema, Document, models, model } from "mongoose";

export interface INote extends Document {
  _id: string;
  userID: string;
  prompt: string;
  generated_quiz: string;
  createdAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    _id: { type: String, required: true },
    userID: { type: String, required: true },
    prompt: { type: String, required: true },
    generated_quiz: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'generated_notes' } // Specify the collection name here
);

// Use models cache to avoid recompilation on hot reload
const Note = models.GeneratedNote || model<INote>("GeneratedNote", NoteSchema);

export default Note;