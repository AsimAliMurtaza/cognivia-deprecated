// models/SessionLog.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISessionLog extends Document {
  userId: string;
  email: string;
  event: "login" | "logout" | "session_refresh";
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

const SessionLogSchema = new Schema<ISessionLog>({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: String, enum: ["login", "logout", "session_refresh"], required: true },
  ip: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.SessionLog ||
  mongoose.model<ISessionLog>("SessionLog", SessionLogSchema);
