import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

// Extend the User interface to include custom fields
interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  gender?: string | null;
  is2FAEnabled?: boolean;
  is2FAVerified?: boolean;
  requires2FA?: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, otp } = credentials;
        await dbConnect();
        const user = await User.findOne({ email });

        if (!user) return null;
        if (!user.verified) throw new Error("Please verify your email first");

        // Second step - OTP verification
        if (otp) {
          if (!user.is2FAEnabled) return null;

          // Verify OTP
          if (
            !user.twoFactorOtp ||
            !user.twoFactorOtpExpiry ||
            user.twoFactorOtp !== otp ||
            new Date() > user.twoFactorOtpExpiry
          ) {
            return null;
          }

          // Clear OTP after successful verification
          user.twoFactorOtp = null;
          user.twoFactorOtpExpiry = null;
          await user.save();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            gender: user.gender,
            is2FAEnabled: true,
            is2FAVerified: true,
          };
        }

        // First step - password verification
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        // If 2FA enabled, generate and send OTP
        if (user.is2FAEnabled) {
          const otpCode = Math.floor(
            100000 + Math.random() * 900000
          ).toString();
          const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

          user.twoFactorOtp = otpCode;
          user.twoFactorOtpExpiry = expiry;
          await user.save();

          await sendEmail({
            from: process.env.EMAIL_USER as string,
            to: user.email,
            subject: "Your 2FA Verification Code",
            text: `Your verification code is: ${otpCode}`,
          });

          return {
            id: user._id.toString(),
            email: user.email,
            requires2FA: true,
            is2FAEnabled: true,
          };
        }

        // Regular login without 2FA
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          gender: user.gender,
          is2FAEnabled: false,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/login/2fa-verification",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.gender = (user as ExtendedUser).gender as string;
        token.is2FAEnabled = (user as ExtendedUser).is2FAEnabled || false;
        token.is2FAVerified = (user as ExtendedUser).is2FAVerified || false;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          name: token.name,
          email: token.email,
          image: token.image as string,
          gender: token.gender as string | null,
          is2FAEnabled: token.is2FAEnabled as boolean,
          is2FAVerified: token.is2FAVerified as boolean,
        },
      };
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if ((user as ExtendedUser)?.requires2FA) {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        return `${baseUrl}/login/2fa-verification?email=${encodeURIComponent(
          user.email ?? ""
        )}`;
      }

      return true;
    },
  },
};
