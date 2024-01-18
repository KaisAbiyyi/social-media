import { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { DefaultSession } from 'next-auth'

type UserId = string

declare module 'next-auth/jwt' {
    interface JWT {
        id: UserId
        username?: string | null
    }
}

declare module 'next-auth' {
    interface Session {
        user: DefaultSession & {
            id: UserId
            username?: string | null,
            image?: string | null,
            email: string,
            name: string
        }
    }
}