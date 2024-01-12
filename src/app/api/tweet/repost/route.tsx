import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { tweetId, userId } = await request.json()
        const repostedTweet = await prisma.repost.findFirst({
            where: {
                tweetId,
                userId,
            }
        })
        if (repostedTweet) {
            const removeRepost = await prisma.repost.delete({
                where: {
                    id: repostedTweet.id,
                    tweetId, userId
                }
            })
            return NextResponse.json({
                success: true,
                message: "Repost Already Removed",
            }, { status: 200 })
        } else {
            const data = await prisma.repost.create({
                data: {
                    tweetId,
                    userId
                }
            })
            if (data) return NextResponse.json({
                success: true,
                message: "Tweet Reposted",
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