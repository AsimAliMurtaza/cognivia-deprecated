import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  userId?: string;
  userEmail?: string;
  action: string;
  role?: string;
  type: "action" | "session";
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userId: { type: String },
    userEmail: { type: String },
    role: { type: String },
    type: {
      type: String,
      enum: ["action", "session"],
      required: true,
    },
    action: { type: String, required: true },
    sessionId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const AuditLog =
  mongoose.models?.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
