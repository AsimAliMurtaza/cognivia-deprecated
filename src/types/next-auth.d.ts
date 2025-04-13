// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extended User type that includes your custom fields
   */
  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
    requires2FA?: boolean;
  }

  /**
   * Extended Session type that includes your custom user fields
   */
  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  /** 
   * Extended JWT type that includes your custom fields 
   */
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
    requires2FA?: boolean;
  }
}