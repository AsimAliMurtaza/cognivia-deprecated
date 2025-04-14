// models/Quiz.ts
import mongoose, { Schema, Document } from "mongoose";

interface IQuiz extends Document {
  _id: string; // This is the unique identifier for the quiz, typically a string.
  userID: string; // Changed from userID to userId to match the POST request. Consistency is key.
  topic: string;
  questions: string[];
  options: string[][];
  answers: string[];
  createdAt: Date;
}

const QuizSchema: Schema = new Schema({
  _id: { type: String, required: true }, // This is the unique identifier for the quiz, typically a string.
  userID: { type: String, required: true }, // Changed from userID to userId
  topic: { type: String, required: true },
  questions: { type: [String], required: true },
  options: { type: [[String]], required: true },
  answers: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
