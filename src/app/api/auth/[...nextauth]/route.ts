import { prisma } from '@/lib/db'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt'
import { nanoid } from 'nanoid'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email here..."
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password here..."
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) return null


                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) return null

                const isPasswordValid = compareSync(credentials.password, user.password ?? '')

                if (!isPasswordValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    image: user.image
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.user.username = token.username as string
            }
            return session
        },
        async jwt({ token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token.email
                }
            })

            if (!dbUser) {
                token.id = user!.id
                return token
            }
            if (!dbUser.username) {
                await prisma.user.update({
                    where: {
                        id: dbUser.id
                    },
                    data: {
                        username: nanoid(10)
                    }
                })
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                image: dbUser.image,
                username: dbUser.username,
            }
        },
    },
    pages: {
        signIn: '/'
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

