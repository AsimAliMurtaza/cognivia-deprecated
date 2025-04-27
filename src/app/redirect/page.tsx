// app/redirect/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  console.log("Session:", session.user?.role);
  if (session?.user?.role === "admin") {
    redirect("/admin/dashboard");
  } else {
    redirect("/dashboard");
  }
}