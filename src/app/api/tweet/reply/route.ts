import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ReplyButtonValidator } from "@/lib/validators/ActionButtonValidator";
import { NextResponse } from "next/server";

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
        const { text, userId, tweetId } = ReplyButtonValidator.parse(body)
        const requiredFields = ["text", "userId"];
        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }

        const reply = await prisma.tweet.findFirst({
            where: {
                id: tweetId
            }
        })

        if (!reply) {
            return NextResponse.json({
                success: false,
                message: "Invalid Tweet ID"
            }, { status: 404 })
        }

        const data = await prisma.tweet.create({
            data: {
                text,
                userId,
                repliedId: tweetId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Reply created",
            data
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        }, { status: 403 })
    }
}