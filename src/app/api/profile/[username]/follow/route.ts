import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FollowUserValidator } from "@/lib/validators/FollowUserValidator";
import { NextResponse } from "next/server";
import { z } from "zod";

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
        const { username } = FollowUserValidator.parse(body)

        const user = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid User username"
            }, { status: 404 })
        }

        const follow = await prisma.follows.findFirst({
            where: {
                followerId: session.user.id,
                followingId: user.id
            }
        })
        if (follow) {
            await prisma.follows.delete({
                where: {
                    id: follow.id
                }
            })
        } else {
            await prisma.follows.create({
                data: {
                    followerId: session.user.id,
                    followingId: user.id
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: "User followed"
        }, { status: 200 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 422 })
        }
        return NextResponse.json({
            success: false,
            message: "Could not follow user",
        }, { status: 500 })
    }
}