import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (credentials?.email === 'demo@studynotes.com' && credentials?.password === 'demo123') {
            return {
              id: '1',
              email: 'demo@studynotes.com',
              name: 'Demo User',
            }
          }

          if (credentials?.email === 'student@example.com' && credentials?.password === 'student123') {
            return {
              id: '2',
              email: 'student@example.com',
              name: 'Student User',
            }
          }

          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // Type assertion for session user to allow adding `id`
        (session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
}

// Use correct types for Next.js app router handlers
import type { NextRequest } from 'next/server'
import type { NextAuthHandler } from 'next-auth'

// Handler for both GET and POST requests
const handler = (req: NextRequest) => NextAuth(req, authOptions)

export { handler as GET, handler as POST }
