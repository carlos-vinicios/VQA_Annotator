import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/services/database/prisma";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        token: { label: "token", type: "text" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (user && user.token === credentials.token) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user &&
        (token.user = {
          email: user.email,
          stage: user.stage,
        });
      return token;
    },
    async session({ session, token }) {
      token && (session.user = token.user);
      return Promise.resolve(session);
    },
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
