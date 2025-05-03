export interface Note {
  _id: string;
  prompt: string;
  generated_quiz: string;
  createdAt: Date; // or Date
}

export type AuditLog = {
  _id: string;
  userEmail: string;
  action: string;
  role: string;
  createdAt: string;
  type: "action" | "session";
  sessionId?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
};
