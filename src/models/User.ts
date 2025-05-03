import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
  gender?: string;
  role?: string;
  verified: boolean;
  verificationToken?: string;
  is2FAEnabled?: boolean;
  twoFactorOtp?: string;
  twoFactorOtpExpiry?: Date;
  accessToken?: string;
  createdAt?: Date;
  loginAttempts?: number;
  isAccountLocked?: boolean;
  unblockToken?: string;
  unblockTokenExpires?: Date; 
  lastLogin?: Date;
  credits: number;
  creditHistory: {
    type: "usage" | "purchase";
    amount: number;
    date: Date;
    description?: string;
  }[];

  subscription?: {
    active: boolean;
    planId?: string;
    creditsPerMonth?: number;
    nextBillingDate?: Date;
  };
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  isAccountLocked: {
    type: Boolean,
    default: false,
  },
  unblockToken: {
    type: String,
    default: null,
  },
  unblockTokenExpires: {
    type: Date,
    default: null,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  accessToken: {
    type: String,
    default: null,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: null,
  },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorOtp: { type: String, default: "" },
  twoFactorOtpExpiry: { type: Date, default: null },

  // Credit-based payment model fields
  credits: {
    type: Number,
    default: 200, // Free credits on signup
  },
  creditHistory: [
    {
      type: {
        type: String,
        enum: ["usage", "purchase"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
        default: "",
      },
    },
  ],
  subscription: {
    active: { type: Boolean, default: false },
    planId: { type: String, default: null },
    creditsPerMonth: { type: Number, default: null },
    nextBillingDate: { type: Date, default: null },
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
