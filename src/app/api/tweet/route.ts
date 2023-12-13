import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const data = await prisma.tweet.findMany({
        include: {
            User: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return NextResponse.json({
        success: true,
        data
    }, { status: 200 })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { text, userId } = body
        const requiredFields = ["text", "userId"];

        const errResponse = requiredFields
            .filter(field => !body[field])
            .map(field => ({ error: `${field.charAt(0).toUpperCase() + field.slice(1)} cannot be null` }));

        if (errResponse.length > 0) {
            return NextResponse.json({ success: false, message: errResponse }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Invalid user id"
            }, { status: 403 });
        }

        const tweet = await prisma.tweet.create({
            data: {
                text,
                userId
            }
        })

        return NextResponse.json({
            success: true,
            message: "Tweet posted"
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Invalid JSON"
        })
    }
}