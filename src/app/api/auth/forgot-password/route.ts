import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // your DB util
import User from "@/models/User";
import crypto from "crypto";
import { sendPasswordEmail } from "@/lib/mailer"; // implement this

export async function POST(req: Request) {
  await dbConnect();
  const { email } = await req.json();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({
      message: "If that email exists, a reset link has been sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 1000 * 60 * 30; // 30 mins

  user.passwordResetToken = token;
  user.passwordResetExpires = expiry;
  await user.save();

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await sendPasswordEmail(
    user.email,
    "Password Reset",
    `
    Click the link to reset your password: ${resetLink}
    If you didn&apos;t request this, ignore this email.
  `
  );

  return NextResponse.json({
    message: "If that email exists, a reset link has been sent.",
  });
}
