import type { NextAuthOptions, Session as NextAuthSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

// Extend session and token types
interface ExtendedSession extends NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean; // Add this
  };
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

        // If OTP is provided, this is the second step (after 2FA verification)
        if (otp) {
          // Verify the user exists and has 2FA enabled
          if (!user.is2FAEnabled) return null;


          // Check if the OTP matches (already verified by your API endpoint)
          // We trust this step since it passed the /api/auth/2fa/verify endpoint
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            is2FAEnabled: true,
            is2FAVerified: true,
          };
        }

        // First step - password verification
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        // If 2FA is enabled, require OTP
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


          // Return special object to trigger 2FA flow
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
        token.is2FAEnabled = (user as any).is2FAEnabled;
        token.is2FAVerified = (user as any)?.is2FAVerified || false; // Add this

      }
      return token;
    },
    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          is2FAEnabled: token.is2FAEnabled as boolean,
          is2FAVerified: token.is2FAVerified as boolean, // Add this

        },
      };
    },
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if ((user as any)?.requires2FA) {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        return `${baseUrl}/login/2fa-verification?email=${encodeURIComponent(
          user.email ?? ""
        )}`;
      }

      return true;
    },
  },
};
