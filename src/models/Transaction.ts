import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  stripeSessionId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  purchasedAt: Date;
  productPlan: string;
}

const TransactionSchema: Schema = new Schema({
  stripeSessionId: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  paymentMethod: { type: String },
  purchasedAt: { type: Date, default: Date.now },
  productPlan: { type: String, default: "Unknown" },
});

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
