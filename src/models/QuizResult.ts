import mongoose, { Schema, Document, models } from "mongoose";

export interface IQuizResult extends Document {
  userID: string;
  quizID: string;
  score: number;
  total: number;
  percentage: number;
  createdAt: Date;
}

const QuizResultSchema: Schema = new Schema(
  {
    userID: { type: String, required: true },
    quizID: { type: String, required: true },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const QuizResult =
  models.QuizResult ||
  mongoose.model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
