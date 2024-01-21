import { getAuthSession } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ActionButtonValidator } from "@/lib/validators/ActionButtonValidator"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const session = await getAuthSession()
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        const body = await request.json()
        const { tweetId, userId } = ActionButtonValidator.parse(body)
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