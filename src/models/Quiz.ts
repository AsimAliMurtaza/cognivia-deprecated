// models/Quiz.ts
import mongoose, { Schema, Document } from "mongoose";

interface IQuiz extends Document {
  _id: string;
  userID: string;
  topic: string;
  questions: string[];
  options: string[][];
  answers: string[];
  createdAt: Date;
  isTaken?: boolean;
  score?: number;
  difficulty?: string;
  questionCount?: number;
}

const QuizSchema: Schema = new Schema({
  _id: { type: String, required: true },
  userID: { type: String, required: true },
  topic: { type: String, required: true },
  questions: { type: [String], required: true },
  options: { type: [[String]], required: true },
  answers: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  isTaken: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
});

const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
