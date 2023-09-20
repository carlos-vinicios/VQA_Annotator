import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  session: {
    strategy: 'jwt'
  },
  secret: process.env.JWT_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'email', type: 'email'},
        token: { label: 'token', type: 'text' }
      },
      async authorize(credentials) {        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if(user && user.token === credentials.token) {
          return user;
        }
        
        return null;
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }