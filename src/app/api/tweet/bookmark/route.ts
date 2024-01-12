import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { tweetId, userId } = await request.json()
        const bookmarkedTweet = await prisma.bookmark.findFirst({
            where: {
                tweetId,
                userId,
            }
        })
        if (bookmarkedTweet) {
            const removeBookmark = await prisma.bookmark.delete({
                where: {
                    id: bookmarkedTweet.id,
                    tweetId, userId
                }
            })
            return NextResponse.json({
                success: true,
                message: "Bookmark Already Removed",
            }, { status: 200 })
        } else {
            const data = await prisma.bookmark.create({
                data: {
                    tweetId,
                    userId
                }
            })
            if (data) return NextResponse.json({
                success: true,
                message: "Tweet Bookmarked",
                data
            }, { status: 201 })
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        }, { status: 403 })
    }
}