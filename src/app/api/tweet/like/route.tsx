import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { tweetId, userId } = await request.json()
        const likedTweet = await prisma.like.findFirst({
            where: {
                tweetId,
                userId,
            }
        })
        if (likedTweet) {
            const removeLike = await prisma.like.delete({
                where: {
                    id: likedTweet.id,
                    tweetId, userId
                }
            })
            return NextResponse.json({
                success: true,
                message: "Like Already Removed",
            }, { status: 200 })
        } else {
            const data = await prisma.like.create({
                data: {
                    tweetId,
                    userId
                }
            })
            if (data) return NextResponse.json({
                success: true,
                message: "Tweet Liked",
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