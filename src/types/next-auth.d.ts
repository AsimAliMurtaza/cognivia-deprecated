// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    gender?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    gender?: string;
    is2FAEnabled?: boolean;
    is2FAVerified?: boolean;
  }
}