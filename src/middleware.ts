import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    async function middleware(req) {
        const token = req.nextauth.token
        if (token && req.url.match(/^https?:\/\/[^#?\/]+\/$/)) {
            return NextResponse.redirect(new URL('/home', req.url))
        }
        if (!token && !req.url.match(/^https?:\/\/[^#?\/]+\/$/)) {
            return NextResponse.redirect(new URL('/', req.url))
        }
    }
)