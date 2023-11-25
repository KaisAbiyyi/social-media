import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
    const token = await getToken({ req })
    const isAuthenticated = !!token

    if (req.nextUrl.pathname === '/' && isAuthenticated) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    const authMiddleware = withAuth({
        pages: {
            signIn: "/"
        }
    })

    return authMiddleware(req as any, event);
}
