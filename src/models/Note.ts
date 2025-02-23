import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  userID: string;
  noteID: string;
  content: string;
}

const NoteSchema = new Schema<INote>(
  {
    userID: { type: String, required: true },
    noteID: { type: String, required: true, unique: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Note = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
export default Note;
