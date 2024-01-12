import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { text, userId, tweetId, repliedId } = body
        const requiredFields = ["text", "userId"];
        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }

        if (repliedId) {
            const reply = await prisma.reply.findFirst({
                where: {
                    id: repliedId
                }
            })

            if (!reply) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid Reply ID"
                }, { status: 404 })
            }

            const data = await prisma.reply.create({
                data: {
                    text,
                    userId,
                    repliedId
                }
            })

            return NextResponse.json({
                success: true,
                message: "Reply created",
                data
            }, { status: 201 })
        } else {
            const tweet = await prisma.tweet.findFirst({
                where: {
                    id: tweetId
                }
            })
            if (!tweet) {
                return NextResponse.json({
                    success: false,
                    message: "Invalid Tweet ID"
                }, { status: 404 })
            }
            const data = await prisma.reply.create({
                data: {
                    text,
                    userId,
                    tweetId
                }
            })

            return NextResponse.json({
                success: true,
                message: "Reply created",
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