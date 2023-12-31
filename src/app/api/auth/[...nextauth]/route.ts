import { compareSync } from 'bcrypt'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient, User } from '@prisma/client'
import { generateRandomNumberString } from '@/lib/utils'
const prisma = new PrismaClient()
const randomNumber = generateRandomNumberString(4)

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
                    username: user.username
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    events: {
        signIn: async ({ user, isNewUser }) => {
            const findUser = await prisma.user.update({
                where: {
                    email: user.email ?? "",
                },
                data: {
                    username: user.name?.toLowerCase().replaceAll(' ', '') + randomNumber
                }
            })
        }
    },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    username: token.username ?? token.name?.toLowerCase().replaceAll(' ', '') + randomNumber
                }
            }
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as User
                return {
                    ...token,
                    id: u.id,
                    username: u.username ?? u.name?.toLowerCase().replaceAll(' ', '') + randomNumber
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/'
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }