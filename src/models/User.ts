// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  image?: string;
  gender?: string;
  verified: boolean;
  verificationToken?: string;
  is2FAEnabled?: boolean;
  twoFactorOtp?: string;
  twoFactorOtpExpiry?: Date;
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
  gender: {
    type: String,
    default: "",
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

});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
