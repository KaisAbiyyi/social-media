import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(request: Request, { params }: { params: { tweetId: string } }) {
    try {
        const tweetId = params.tweetId
        await prisma.tweet.delete({
            where: {
                id: tweetId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Tweet Deleted"
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 403 })
    }
}

export async function GET(request: Request, { params }: { params: { tweetId: string } }) {
    try {
        const tweetId = params.tweetId
        const Tweet = await prisma.tweet.findFirst({
            where: {
                id: tweetId
            },
            include: {
                User: true,
                Like: true,
                Bookmark: true,
                Repost: true,
                Reply: true,
                quote: {
                    include: {
                        User: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            message: "Tweet details",
            data: Tweet
        }, { status: 200 })

    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong"
        }, { status: 403 })
    }
}