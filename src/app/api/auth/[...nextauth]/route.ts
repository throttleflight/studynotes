import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // For demo purposes, we'll use hardcoded credentials
          // In production, you would validate against a database
          if (credentials?.email === 'demo@studynotes.com' && credentials?.password === 'demo123') {
            return {
              id: '1',
              email: 'demo@studynotes.com',
              name: 'Demo User',
            } as const
          }
          
          // You can add more demo users here
          if (credentials?.email === 'student@example.com' && credentials?.password === 'student123') {
            return {
              id: '2',
              email: 'student@example.com',
              name: 'Student User',
            } as const
          }
          
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          // Define a proper interface for session.user to avoid any
          interface UserWithId {
            id?: string
          }
          (session.user as UserWithId).id = token.id as string
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
