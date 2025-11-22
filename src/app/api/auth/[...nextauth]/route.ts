import NextAuth, { type AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Auth attempt started");
        console.log("📝 Credentials received:", {
          username: credentials?.username,
          hasPassword: !!credentials?.password,
        });

        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          console.log("👤 User lookup result:", {
            found: !!user,
            username: user?.username,
            role: user?.role,
          });

          if (!user) return null;

          const isValid = credentials.password === user.password;

          if (!isValid) return null;

          console.log("✅ Authentication successful");

          // Return full user object including role
          return {
            id: user.id,
            name: user.name || user.username,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("💥 Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.role = token.role as "USER" | "ADMIN" | undefined;
      }
      return session;
    },

    async signIn({ user }) {
      // Redirect admin users after login
      if (user.role === "ADMIN") {
        return "/admin-dashboard";
      }
      return true; // default behavior for other users
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
