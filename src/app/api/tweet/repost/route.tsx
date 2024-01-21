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