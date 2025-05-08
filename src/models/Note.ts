// models/Note.ts
import { Schema, Document, models, model } from "mongoose";

export interface INote extends Document {
  _id: string;
  userID: string;
  prompt: string;
  generated_quiz: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    _id: { type: String, required: true },
    userID: { type: String, required: true },
    prompt: { type: String, required: true },
    generated_quiz: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: "generated_notes" }
);

const Note = models.GeneratedNote || model<INote>("GeneratedNote", NoteSchema);

export default Note;
