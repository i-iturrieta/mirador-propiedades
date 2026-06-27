import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isOnLogin = request.nextUrl.pathname.startsWith("/admin/login");
      if (isOnLogin) return true;
      if (isOnAdmin) return !!auth?.user;
      return true;
    },
  },
};
